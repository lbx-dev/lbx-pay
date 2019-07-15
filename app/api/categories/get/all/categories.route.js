const controller = require('./categories.controller');
const apiPrefix = require('app/api/common/constants/constants.service').constants.url.API_PREFIX;

async function getAllCategoriesRoute(req, res) {
  const response = await controller.getCategories(req.headers.language);

  res.status(response.code).json(response.payload);
}
module.exports = function (app) {
  app.get(apiPrefix + '/categories', getAllCategoriesRoute);
};
/**
 * @api {get} /api/categories/ 01 - List existing categories on server
 * @apiName Get categories
 * @apiGroup Category
 * @apiDescription Api endpoint that fetches categories from the server.
 *
 * @apiVersion 0.0.1
 *
 *
 * @apiSuccess {Array} roles Array of roles
 * @apiSuccess {Integer} roles.id The ID
 * @apiSuccess {String} roles.name Name od the role
 * @apiSuccessExample {json} Success-Response:
 {
    "categories": [
        {
            "id": "2c3e12d2-2311-4ecd-8b30-07ab05d02031",
            "name": "10+ inch"
        },
        {
            "id": "28414aae-0e7a-4e50-bad0-43e034eef16d",
            "name": "18-19 years"
        },
        .
        .
        .
        .

        {
            "id": "77a41ccf-19bc-4f07-8571-c0e5d4ba2e43",
            "name": "Young"
        }
    ]
}
 */