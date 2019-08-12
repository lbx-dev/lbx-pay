const service = require('./pay.service');

const { constants } = require('app/api/common/constants/constants.service');
const apiPrefix = constants.url.API_PREFIX;
const { addSecured } = require('app/api/authentication/security/security.service');


async function getGrowthBondsRoute(req, res) {
  const { language } = req.headers;

  const response = await service.getBondPlans(language);

  res.status(response.code).json(response.payload);
}

module.exports = function(app) {
  const url = `${ apiPrefix }/pay/growth-bonds`;

  addSecured({ url, method: 'GET' });
  app.get(url, getGrowthBondsRoute);
};