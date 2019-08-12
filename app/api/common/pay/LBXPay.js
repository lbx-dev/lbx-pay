const configuration = require('configuration/block-io/configuration');
const BlockIo = require('block_io');
const bluebird = require('bluebird');
const { environment } = require('app/common/environment/environment.service');
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
}

let pay;
if(!pay) {
  pay = new LBXPay();
}

module.exports = pay;