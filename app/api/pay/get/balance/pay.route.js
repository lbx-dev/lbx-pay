const { transform, transformArray } = require('app/api/common/transform-database-data/transform-data.service')
const { constants } = require('app/api/common/constants/constants.service');
const { validCall } = require('app/api/common/responses/responses.service');

const apiPrefix = constants.url.API_PREFIX;
const { addSecured } = require('app/api/authentication/security/security.service');

const payService = require('app/api/common/pay/LBXPay');

async function getBalanceRoute(req, res) {
  let response;

  const { security } = req.headers;
  const { role, id } = security;
  const { id: roleId } = role;

  if(roleId === constants.users.roles.USER) {
    const { data: unpreparedBalance } = await payService.getAddressBalance(id);
    const balance = transform(unpreparedBalance);
    if(balance.balances) {
      balance.balances = transformArray(balance.balances);
    }
    response = validCall( { balance });
  } else {
    const { data: unpreparedBalance } = await payService.getAddressBalance('default');
    const balance = transform(unpreparedBalance);
    if(balance.balances) {
      balance.balances = transformArray(balance.balances);
    }
    response = validCall( { balance });
  }

  res.status(response.code).json(response.payload);
}

module.exports = function(app) {
  const url = `${ apiPrefix }/pay/balance`;

  addSecured({ url, method: 'GET' });
  app.get(url, getBalanceRoute);
};