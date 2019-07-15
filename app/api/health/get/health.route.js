const databaseService = require('app/database/database.service');

async function healthRoute(req, res) {
  const { persistence, memory } = databaseService.get();

  try {
    await persistence.raw('SELECT 1;');
    await memory.raw('SELECT 1;');

    res.status(200).json({
      health: {
        api: true,
        memory: true,
        persistence: true
      }
    });

  } catch(error) {
    res.status(500).json(error);
  }

}

module.exports = function (app) {
  app.get('/api/health', healthRoute);
};