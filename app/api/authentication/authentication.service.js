const databaseService = require('app/database/database.service');
const { responses } = require('app/api/common/responses/responses.service');
const keccak = require('keccak');
const logger = require('app/common/log/logger.service');

function generateSessionToken(id) {
  const statement = `
    User ${id} logged in.
    Timestamp: ${(new Date()).toISOString()}
    Control string ${Math.random()}
  `;

  return keccak('keccak512').update(statement).digest('hex');
}

async function createSession(user, language) {
  const { memory: database } = databaseService.get();4

  let sessionId;

  async function transaction(t) {
    const sessionCreationSQL = `
      INSERT INTO
        session (
          session_id,
          user_id,
          role_id,
          role_name,
          first_name,
          last_name,
          email,
          expires
        )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?
      );
    `;
    const partnerCreationSQL = `
      REPLACE INTO
        partner (
          partner_id,
          user_id,
          name,
          verified
        )
      VALUES (
        ?, ?, ?, ?
      );
    `;
    const now = new Date();
    sessionId = generateSessionToken(user.id);

    now.setDate(now.getDate() + 1);
    const nowISO = now.toISOString();

    await t.raw(sessionCreationSQL, [
      sessionId,
      user.id,
      user.role.id,
      user.role.name,
      user.firstName,
      user.lastName,
      user.email,
      nowISO
    ]);
    if(user.partner) {
      await t.raw(partnerCreationSQL, [ user.partner.id, user.id, user.partner.name, user.partner.verified ]);
    }
  }

  try {
    await database.transaction(transaction);
  } catch(error) {
    if(Number(error.errno) === 5) {
      return await createSession(user, language);
    }
    logger.error(`Database error at ${__filename}`);
    logger.log({ level: 'error', message: error.message });
    throw responses[language].UNKNOWN_SERVER_ERROR;
  }

  return sessionId;
}

async function getSessionById(id) {

  let session = null;

  const { memory: database } = databaseService.get();

  async function transaction(t) {
    const fetchSessionSQL = `
      SELECT 
        session_id,
        s.user_id,
        role_id,
        role_name,
        first_name,
        last_name,
        email,
        expires,
        p.partner_id AS partner_id,
        p.name AS partner_name,
        p.verified AS partner_verified
      FROM 
        session AS S LEFT OUTER JOIN partner p ON p.user_id = s.user_id
      WHERE 
        session_id = ?
    `;

    const data = await t.raw(fetchSessionSQL, [ id ]).transacting(t);
    const timestamp = new Date();

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
      await t.raw('DELETE FROM partner where user_id = (SELECT user_id FROM session WHERE session_id = ?);', [ id ]).transacting(t);
      await t.raw('DELETE FROM session where session_id = ?;', [ id ]).transacting(t);
    }

  }

  await database.transaction(transaction);

  return session;
}

function getSessionByEmail(email) {
  const { memory: database } = databaseService.get();
  const sql = `
     SELECT session_id FROM SESSION WHERE email = ?;
  `;

  return database.raw(sql, [ email ]);
}

function deleteSessionById(id) {
  const { memory: database } = databaseService.get();
  return database.raw('DELETE FROM session where session_id = ?;', [ id ]);
}

function deleteSessionByUserId(id) {
  const { memory: database } = databaseService.get();

  async function transaction(t) {
    await t.raw('DELETE FROM partner where user_id = ?);', [ id ]).transacting(t);
    await t.raw('DELETE FROM session where user_id = ?;', [ id ]).transacting(t);
  }

  return database.transaction(transaction);
}

module.exports = {
  createSession,
  getSessionById,
  getSessionByEmail,
  deleteSessionById,
  deleteSessionByUserId
};