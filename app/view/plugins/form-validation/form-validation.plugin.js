export default function(context, inject) {
  const emailRegex = new RegExp('^([A-Za-z0-9._%+-]|"|”|“|\\\\| |“.*”){0,64}([A-Za-z0-9_%+-]|"|”|“|\\\\| |“.*”)@[A-Za-z0-9][A-Za-z0-9.-]*\\.[A-Za-z]{2,}$');
  const imageRegex = new RegExp('^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$');
  const zipCodeRegex = new RegExp('^[0-9]{5}(?:-[0-9]{4})?$');

  function isEmailValid(email) {
    return emailRegex.test(email);
  }

  function isZipCodeValid(zipCode) {
    return zipCodeRegex.test(zipCode);
  }

  function isImageValid(imageData) {
    let extension = null;

    if(imageData.indexOf('data:image/jpeg;base64,') === 0) {
      imageData = imageData.replace(/^data:image\/jpeg;base64,/, '');
      extension = 'jpg';
    } else if(imageData.indexOf('data:image/svg+xml;base64,') === 0) {
      imageData = imageData.replace(/^data:image\/svg\+xml;base64,/, '');
      extension = 'svg';
    } else if(imageData.indexOf('data:image/png;base64,') === 0) {
      imageData = imageData.replace(/^data:image\/png;base64,/, '');
      extension = 'png';
    } else if(imageData.indexOf('data:image/gif;base64,') === 0) {
      imageData = imageData.replace(/^data:image\/gif;base64,/, '');
      extension = 'gif';
    } else {
      return null;
    }

    if(imageRegex.test(imageData)) {
      return extension;
    }
    return null;
  }

  function getValidators() {
    return {
      firstNameRules: [
        v => !!v || this.$t('formValidation.NO_FIRST_NAME'),
        v => v.length < 128 || this.$t('formValidation.INVALID_FIRST_NAME_TOO_LONG')
      ],
      lastNameRules: [
        v => !!v || this.$t('formValidation.NO_LAST_NAME'),
        v => v.length < 128 || this.$t('formValidation.INVALID_LAST_NAME_TOO_LONG')
      ],
      emailRules: [
        v => !!v || this.$t('formValidation.NO_EMAIL'),
        v => emailRegex.test(v) || this.$t('formValidation.INVALID_EMAIL')
      ],
      repeatPasswordRules: [
        () => this.password === this.repeatPassword || this.$t('formValidation.PASSWORDS_DO_NOT_MATCH')
      ],
      partnerNameRules: [
        v => !!v || this.$t('formValidation.NO_PARTNER_NAME'),
        v => v.length < 64 || this.$t('formValidation.PARTNER_NAME_TOO_LONG')
      ],
      partnerIdentificationRules: [
        v => !!v || this.$t('formValidation.NO_PARTNER_IDENTIFICATION'),
        v => v.length < 64 || this.$t('formValidation.PARTNER_IDENTIFICATION_TOO_LONG')
      ],
      partnerCityRules: [
        v => !!v || this.$t('formValidation.PARTNER_NO_CITY'),
        v => v.length < 64 || this.$t('formValidation.PARTNER_CITY_TOO_LONG')
      ],
      partnerAddressRules: [
        v => !!v || this.$t('formValidation.PARTNER_NO_ADDRESS'),
        v => v.length < 128 || this.$t('formValidation.PARTNER_ADDRESS_TOO_LONG')
      ],
      partnerPostalCodeRules: [
        v => !!v || this.$t('formValidation.PARTNER_NO_POSTAL_CODE'),
        () => zipCodeRegex.test(this.postalCode) || this.$t('formValidation.PARTNER_INVALID_POSTAL_CODE')
      ],
      originImageRules: [
        v => !!v || this.$t('formValidation.NO_ORIGIN_CONFIRMATION_IMAGE'),
        () => !!isImageValid(this.originImageFile) || this.$t('formValidation.INVALID_ID_ORIGIN_CONFIRMATION_IMAGE')
      ],
      isEmailValid,
      isImageValid,
      isZipCodeValid
    };
  }

  inject('formValidators', getValidators);
  context.$formValidators = getValidators;
}