const { constants } = require('app/api/common/constants/constants.service');
const { httpStatus } = constants;
const bluebird = require('bluebird');
const { baseURL } = require('app/common/environment/environment.service');
const emailConfiguration = require('configuration/email/email-configuration.service');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(emailConfiguration);

const us = require('./us/en-US');
const rs = require('./rs/rs-RS');

const responses = { us, rs };

function validCall(payload) {
  return {
    code: httpStatus.OK, payload: payload
  };
}
function successfulCreation(payload) {
  return {
    code: httpStatus.CREATED, payload: payload
  };
}

const composeEmail = {
  REGISTRATION_CONFIRMATION(user, language) {
    if(language === 'us') {
      return {
        from: `"Concierge Service" <${emailConfiguration.auth.user}>`,
        to: `${user.email}`,
        subject: 'Registration successful ✔',
        text: `
            Hello ${user.firstName} ${user.lastName},
            
            You or somebody on your behalf registered on Klitstarter.

            If this was not you please disregard or report this email. Otherwise you can proceed to
             
            ${baseURL}/${language}/confirm-registration/${user.confirmationToken}
            
            Best regards,
            Klitstarter concierge service
            `,
        html: `
            <p>
             Hello ${user.firstName} ${user.lastName},
            </p>
            <p>
             You or somebody on your behalf registered on website.
            </p>
            <p>
              If this was not you please disregard or report this email. Otherwise you can proceed to
              <a href="${baseURL}/${language}/confirm-registration/${user.confirmationToken}"> here </a> to confirm your registration
            </p>
            <p>
                Best regards,
            </p>
            <p>
                Klitstarter concierge service
            </p>`
      };
    } else if(language === 'rs') {
      return {
        from: `"Concierge Service" <${emailConfiguration.auth.user}>`,
        to: `${user.email}`,
        subject: 'Registration successful ✔',
        text: `
            Zdravo,
            
            Vi ste se ili neko u Vaše ime registrovali na Klitstarteru.

            Ako to niste bili Vi slobodno ignorišite ovaj e-mail. Inače možete nastaviti na 
             
            ${baseURL}/${language}/potvrda-registracije/${user.confirmationToken}
            
            Sve najbolje,
            Klitstarter servis
            `,
        html: `
            <p>
              Zdravo,
            </p>
            <p>
              Vi ste se ili neko u Vaše ime registrovali na Klitstarteru.
            </p>
            <p>
              Ako to niste bili Vi slobodno ignorišite ovaj e-mail. Inače možete nastaviti 
              <a href="${baseURL}/${language}/potvrda-registracije/${user.confirmationToken}"> ovde </a> da biste potvrdili vašu registraciju
            </p>
            <p>
                sve najbolje,
            </p>
            <p>
                Klitstarter servis
            </p>`
      };
    }
  },
  PASSWORD_RESTORATION_REQUEST(user, language) {
    if(language === 'us') {
      return {
        from: `"Concierge Service" <${emailConfiguration.auth.user}>`,
        to: `${user.email}`,
        subject: 'Forgot password ❓',
        text: `
            Hello ${user.firstName} ${user.lastName},
            
            Looks like you forgot your password. Go to the link below to restore it. 
            
            ${baseURL}/restore-password/${user.restorationToken}
            If this was not you please disregard or report this email.
            Best regards,
            Klitstarter team
          `,
        html: `
            <p>
              Hello ${user.firstName} ${user.lastName},
            </p>
            <p>
              Looks like you forgot your password. If this was not you please disregard or report this email.
              Otherwise you can proceed to <a href="${baseURL}/restore-password/${user.restorationToken}"> here </a>
              to restore your password
            </p> 
            <p>
              Best regards,
              Klitstarter team
            </p>`
      };
    } else if(language === 'rs') {
      return {
        from: `"Concierge Service" <${emailConfiguration.auth.user}>`,
        to: `${user.email}`,
        subject: 'Zaboravljena lozinka ❓',
        text: `
            Poštovani,
            
            Izgleda da ste izgubili lozinku. Klikom na link ispod možete promeniti Vašu lozinku. 
            
            ${baseURL}/access/restore-password/${user.restorationToken}
            Ukoliko to niste bili Vi slobodno ignorišite ili prijavite ovaj mejl.
            Sve najbolje,
            Klitstarter servis
          `,
        html: `
            <p>
              Poštovani,
            </p>
            <p>
              Izgleda da ste izgubili lozinku. Ukoliko to niste bili Vi slobodno ignorišite ili prijavite ovaj mejl.
              U suprotnom <a href="${baseURL}/access/restore-password/${user.restorationToken}"> ovde </a>
              možete promeniti Vašu lozinku
            </p> 
            <p>
              Sve najbolje,
              Klitstarter servis
            </p>`
      };
    }
  }
};

function sendEmail(composed) {
  return transporter.sendMailAsync(composed);
}

if(!Promise.promisifyAll) {
  global.Promise = bluebird;
}
Promise.promisifyAll(transporter);

module.exports = {
  responses,
  validCall,
  successfulCreation,
  composeEmail,
  sendEmail
};