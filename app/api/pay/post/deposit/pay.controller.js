const BigNumber = require('bignumber.js');

const service = require('./pay.service');

async function handleCall(userId, body, language) {
  const validation = service.validateCall(body, language);

  if(validation) {
    return validation;
  }
  body.amount = (new BigNumber(body.amount)).dividedBy(100000000).toFixed();
  return await service.saveDeposit(userId, body, language);
}

module.exports = {
  handleCall
};