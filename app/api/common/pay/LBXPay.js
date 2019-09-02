const configuration = require('configuration/block-io/configuration');
const BlockIo = require('block_io');
const bluebird = require('bluebird');
const { environment } = require('app/common/environment/environment.service');
const databaseService = require('app/database/database.service');
const logger = require('app/common/log/logger.service');

global.Promise = bluebird;

class LBXPay {
  constructor() {

    let conf = configuration.testnet;
    if(environment === 'production') {
      conf = configuration.production;
    }

    this.block = new BlockIo(conf.key, conf.pin, 2);
    Promise.promisifyAll(this.block);
  }

  async createAddress(label) {
    return this.block.get_new_addressAsync({ label });
  }

  async getAllBalances() {
    return this.block.get_address_balanceAsync({});
  }

  async getMyAddresses() {
    return this.block.get_my_addressesAsync({});
  }

  async getAddressBalance(label) {
    return this.block.get_address_balanceAsync({ label });
  }

  async archiveAddress(label) {
    return this.block.archive_addressesAsync({ label });
  }

  async unarchiveAddress(label) {
    return this.block.unarchive_addressesAsync({ label });
  }

  async estimateNetworkFee(amount, fromLabels, toLabels) {
    if(!fromLabels && !toLabels) {
      return false;
    }

    let amounts = amount;
    let from_labels = 'default';
    let to_labels = 'default';

    if(Array.isArray(amounts)) {
      amounts = amounts.join(',');
    }
    if(fromLabels) {
      if(Array.isArray(fromLabels)) {
        from_labels = fromLabels.join(',');
      }
      from_labels = fromLabels;
    }
    if(toLabels) {
      if(Array.isArray(toLabels)) {
        to_labels = toLabels.join(',');
      }
      to_labels = toLabels;
    }

    return this.block.get_network_fee_estimateAsync({ from_labels, to_labels, amounts });
  }

  async deposit(label, ammount) {
    return this.block.withdraw_from_labelsAsync({
      amounts: ammount,
      from_labels: label,
      to_labels: 'default'
    });
  }

  async payInterest(amount, toLabels) {
    let amounts = amount;
    let to_labels = toLabels;

    if(Array.isArray(amount)) {
      amounts = amount.join(',');
    }
    if(Array.isArray(toLabels)) {
      to_labels = toLabels.join(',');
    }
    return this.block.withdraw_from_labelsAsync({
      from_labels: 'default',
      amounts,
      to_labels
    });
  }

  async clearing(dryRun) {
    const { persistence: database } = databaseService.get();

    const sql = `
      SELECT
        user_id AS label,
        round(SUM(amount::NUMERIC * monthly_growth::NUMERIC), 8)::VARCHAR AS amount
      FROM
        "public"."deposit" AS d
      JOIN 
        growth_bond AS gb ON d.bond_id = gb.id
      WHERE
        '2019-07-01T00:00:00.000Z'::TIMESTAMP + (duration::VARCHAR || ' month')::INTERVAL > NOW()
      GROUP BY label;
    `;

    const { rows: clearingResult } = await database.raw(sql);

    const receipt = [ `Clearing \t\t ${new Date().toISOString()}`, '' ];
    const labels = [];
    const amounts = [];

    clearingResult.forEach(({ label, amount }) => {
      labels.push(label);
      amounts.push(amount);

      receipt.push(`Sending ${amount} BTC to ${label}`);
    });
    logger.info(receipt.join('\n'));

    if(!dryRun){
      return this.payInterest(amounts, labels);
    }
  }
}

let pay;
if(!pay) {
  pay = new LBXPay();
}

module.exports = pay;