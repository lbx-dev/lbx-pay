const service = require('./registration.service');

async function handleCall(body, language) {
  const validation = service.validateCall(body, language);
  if(validation) {
    return validation;
  }
  body.email = body.email.toLocaleLowerCase();
  body.password = service.createHashedPassword(body.password);
  return await service.saveNewUser(body, language);
}

module.exports = {
  handleCall
};