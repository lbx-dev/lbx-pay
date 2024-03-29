const { constants } = require('app/api/common/constants/constants.service');
const { httpStatus } = constants;

module.exports = {
  AUTHORIZATION_BAD_TOKEN: { code: httpStatus.BAD_REQUEST, payload: 'Neispravan sigurnosni token' },
  AUTHORIZATION_NOT_LOGGED_IN: { code: httpStatus.UNAUTHORIZED, payload: 'Morate biti ulogovani da vidite to' },
  AUTHORIZATION_FORBIDDEN: { code: httpStatus.FORBIDDEN, payload: 'Nije vam dozvoljeno da vidite to' },
  UNKNOWN_SERVER_ERROR: { code: httpStatus.INTERNAL_SERVER_ERROR, payload: 'Nepoznata greška' },
  LOGIN_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Neispravni podaci za logovanje' },
  LOGIN_INVALID_EMAIL: { code: httpStatus.BAD_REQUEST, payload: 'Neispravna e-mail adresa' },
  LOGIN_NO_PASSWORD: { code: httpStatus.BAD_REQUEST, payload: 'Lozinka nije uneda' },
  LOGIN_NO_USER_FOUND: { code: httpStatus.NOT_FOUND, payload: 'Korisnik nije pronađen' },
  LOGIN_USER_NOT_CONFIRMED: { code: httpStatus.FORBIDDEN, payload: 'Korisnik nije potvrdio registraciju' },
  LOGIN_USER_DISABLED: {
    code: httpStatus.BAD_REQUEST,
    payload: 'Korisnik je deaktiviran. Kontaktirajte administratora'
  },
  CONFIRMATION_USER_NOT_FOUND: { code: httpStatus.NOT_FOUND, payload: 'Nije pronađen korisnik za potvrdu' },
  CONFIRMATION_USER_ALREADY_CONFIRMED: { code: httpStatus.OK, payload: 'Korisnik je već potvrđen' },
  CONFIRMATION_USER_CONFIRMED: { code: httpStatus.OK, payload: 'Korisnik potvrđen' },
  REGISTRATION_NO_CONFIRMATION_TOKEN: { code: httpStatus.BAD_REQUEST, payload: 'Neispravan token za potvrdu' },
  REGISTRATION_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Neispravni podaci za registraciju' },
  REGISTRATION_INVALID_FIRST_NAME: { code: httpStatus.BAD_REQUEST, payload: 'Neispravno ime' },
  REGISTRATION_INVALID_LAST_NAME: { code: httpStatus.BAD_REQUEST, payload: 'Neispravno prezime' },
  REGISTRATION_INVALID_ROLE_ID: { code: httpStatus.BAD_REQUEST, payload: 'Neispravan ID role' },
  REGISTRATION_CANNOT_BE_ADMINISTRATOR: {
    code: httpStatus.BAD_REQUEST,
    payload: 'Ne možete se registrovati kao administrator'
  },
  REGISTRATION_INVALID_EMAIL: { code: httpStatus.BAD_REQUEST, payload: 'Neispravna e-mail adresa' },
  REGISTRATION_NO_PASSWORD: { code: httpStatus.BAD_REQUEST, payload: 'Lozinka nije uneta' },
  REGISTRATION_FAILED_USER_ALREADY_REGISTERED: { code: httpStatus.CONFLICT, payload: 'Korisnik je već registrovan' },
  REGISTRATION_FAILED_NO_SUCH_ROLE: { code: httpStatus.BAD_REQUEST, payload: 'Ne postoji ta rola' },
  REGISTRATION_SUCCESSFUL: { code: httpStatus.CREATED, payload: 'Uspešna registracija' },
  FORGOT_PASSWORD_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Neispravan zahtev' },
  FORGOT_PASSWORD_INVALID_EMAIL: { code: httpStatus.BAD_REQUEST, payload: 'Neispravna e-mail adresa' },
  FORGOT_PASSWORD_CALL_SUCCESSFUL: { code: httpStatus.OK, payload: 'Zahtev uspešan! Molimo proverite Vaš e-mail' },
  RESTORE_PASSWORD_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Neispravan zahtev' },
  RESTORE_PASSWORD_NO_PASSWORD: { code: httpStatus.BAD_REQUEST, payload: 'Neispravna lozinka' },
  RESTORE_PASSWORD_INVALID_RESTORATION_TOKEN: {
    code: httpStatus.BAD_REQUEST,
    payload: 'Neispravan token za resetovanje'
  },
  RESTORE_PASSWORD_NO_USER_FOUND: { code: httpStatus.NOT_FOUND, payload: 'Nije pronađen korisnik' },
  RESTORE_PASSWORD_POSSIBLE: { code: httpStatus.OK, payload: 'Nastavite na vraćanje lozinke' },
  RESTORE_PASSWORD_IMPOSSIBLE: {
    code: httpStatus.NOT_FOUND,
    payload: 'Token za vraćanje lozinke nije pronađen. Pokušajte ponovo'
  },
  RESTORE_PASSWORD_SUCCESS: { code: httpStatus.OK, payload: 'Uspešno promenjena lozinka' },
  ROLES_UNAUTHORIZED: { code: httpStatus.UNAUTHORIZED, payload: 'Nemate pristup ovome' },
  DEPOSIT_TOO_LARGE: { code: httpStatus.BAD_REQUEST, payload: 'Depozit je preveliki maksimum je 10000 BTC' },
  DEPOSIT_INVALID_BOND_ID: { code: httpStatus.BAD_REQUEST, payload: 'ID obveznice nije validan' },
  DEPOSIT_INVALID_AMOUNT: { code: httpStatus.BAD_REQUEST, payload: 'Količina nije validna' },
  DEPOSIT_INVALID_DETAILS: { code: httpStatus.BAD_REQUEST, payload: 'Detalji poziva nisu validni' },
  DEPOSIT_NO_SUCH_GROWTH_PLAN: { code: httpStatus.BAD_REQUEST, payload: 'Nije pronađen plan štednje' },
  DEPOSIT_SUCCESS: { code: httpStatus.CREATED, payload: 'Uspešan depozit' },
  ESTIMATE_FEE_NO_AMOUNT: { code: httpStatus.BAD_REQUEST, payload: 'Vrednost nije uneta' }
};