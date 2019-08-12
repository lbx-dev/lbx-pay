/*
const payService = require('./LBXPay');
const assert = require('assert');

const addresses = {
  first: '',
  second: ''
};

async function createSecondAddress() {
  const address = await payService.createAddress('test-label-2');

  assert(address);
  addresses.first = address;
}

async function checkBalance() {
  const { data: data1 } = await payService.getAddressBalance('test-label');

  /!*
  {
    network: 'BTCTEST',
    available_balance: '0.00980842',
    pending_received_balance: '0.0',
    balances:
      [ {
        user_id: 1,
        label: 'test-label',
        address: '2NAJ2W5wgE2NiSg2o1zCHu5KQRRymejp6SD',
        available_balance: '0.00980842',
        pending_received_balance: '0.00000000'
      } ]
  }
  *!/

  console.log(data1);
  //assert.strictEqual(data.available_balance, '0.02251962');
  //assert.strictEqual(data1.pending_received_balance, '0.00980842');
  const { data } = await payService.getAddressBalance('test-label-2');

  console.log(data);
  //assert.strictEqual(data.available_balance, '0.02251962');
  //assert.strictEqual(data.pending_received_balance, '0.00880842');
}

async function checkBalanceNoLabel() {
  const { data: data1 } = await payService.getAddressBalance('default');


  console.log(data1);
}

async function archiveFirstAddress() {
  const data = await payService.archiveAddress('test-label');

  assert(data.status);
}

async function deposit() {
  try {
    const data = await payService.deposit('test-label', '10.009');

    /!*{
      status: 'success',
        data:
      {
        network: 'BTCTEST',
          txid:
        '6247e5cbedd62f97550e6e5260a0dc1728fe9e93fbc90f1f0ab8ba1e13f9dac0',
          amount_withdrawn: '0.00906180',
        amount_sent: '0.00900000',
        network_fee: '0.00006180',
        blockio_fee: '0.00000000'
      }
    }*!/
    assert(data.status);
  } catch(error) {
    console.log(error.message);
  }
}

async function estimateNetworkFee() {
  const data = await payService.estimateNetworkFee('0.00980842', 'default', 'test-label');

  /!*{
    status: 'success',
    data: { network: 'BTCTEST', estimated_network_fee: '0.00007828' }
  }*!/

  assert(data.status);
}

async function payInterest() {
  const data = await payService.payInterest([ '0.00880842', '0.00980842' ], [ 'test-label-2', 'test-label' ]);

  /!*{
    status: 'success',
    data: { network: 'BTCTEST', estimated_network_fee: '0.00007828' }
  }*!/

  assert(data.status);
}

describe('Testing LBXPay service', function() {
  this.timeout(0);

  //it('Create first address', createFirstAddress);
  //it('Create second address', createSecondAddress);
  //it('Check balance', checkBalance);
  //it('Check balance no label', checkBalanceNoLabel);
  //it('Archive first address', archiveFirstAddress);
  //it('Load with faucet and check balance', loadFirstAccountWithFaucet);
  //it('Transfer funds', transferFunds);
  it('Deposit from first wallet', deposit);
  //it('Estimate network fee', estimateNetworkFee);
  // it('Pay interest', payInterest);

});
*/
