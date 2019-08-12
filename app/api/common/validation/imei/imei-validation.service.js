const patternValidationService = require('../pattern/pattern-validation.service');
const stringValidationService = require('../string/string-validation.service');

function sumDigit(number) {
  let sum = 0;
  while(number) {
    sum += number % 10;
    number = Math.floor(number / 10);
  }
  return sum;
}

function isValid(imei) {

  const sanity = stringValidationService.isString(imei) && patternValidationService.isValid(imei, '^[0-9]{15}$');

  if(!sanity) {
    return sanity;
  }

  return imei.split('').map(function(element, index) {
    return Number(element) * (index % 2 + 1);
  }).reduce(function(accumulator, current, index, array) {
    if(index === 14) {
      return ((accumulator + array[14]) % 10) === 0;
    }
    return accumulator + sumDigit(current);

  });
}

module.exports = {
  isValid
};