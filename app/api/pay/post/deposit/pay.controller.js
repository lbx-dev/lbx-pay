const BigNumber = require('bignumber.js');

const service = require('./pay.service');

async function handleCall(userId, body, language) {
  const validation = service.validateCall(body, language);

  if(validation) {
    return validation;
  }
  if(body.amount) {
    body.amount = (new BigNumber(body.amount)).dividedBy(100000000).toFixed();
    return await service.saveDeposit(userId, body, language);
  }
  return await service.depositAll(userId, body, language);
}

module.exports = {
  handleCall
};