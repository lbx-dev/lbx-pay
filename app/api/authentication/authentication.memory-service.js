const databaseService = require('app/database/database.service');

async function getSession(id) {

  let session = null;

  const { memory: database } = databaseService.get();

  async function transaction(t) {

    const data = await t.raw('SELECT * FROM session where session_id = ?;', [ id ]).transacting(t),
      timestamp = new Date();
    if(data.length === 0) {
      return;
    }
    session = data[0];

    if(new Date(session.expires) > timestamp) {
      timestamp.setDate(timestamp.getDate() + 1);
      session.exires = timestamp.toISOString();

      await t.raw('UPDATE session SET expires = ? WHERE session_id = ?;', [ timestamp.toISOString(), id ]).transacting(t);

    } else {
      session = null;
      await t.raw('DELETE FROM session where session_id = ?;', [ id ]).transacting(t);
    }

  }

  await database.transaction(transaction);

  return session;
}

module.exports = {
  getSession
};