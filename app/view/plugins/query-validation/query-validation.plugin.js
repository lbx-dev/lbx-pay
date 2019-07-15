function parseStrictInt(variable) {
  if(/^(\-|\+)?([0-9]+|Infinity)$/.test(variable)) {
    return Number(variable);
  }
  return NaN;
}
function isPositiveInteger(variable) {
  const parsed = parseStrictInt(variable);

  return !isNaN(parsed) && parsed > 0;
}
function isPositiveOrZeroInteger(variable) {
  const parsed = parseStrictInt(variable);

  return !isNaN(parsed) && parsed >= 0;
}

export default function (context, inject) {
  function isQueryValid(query) {
    const validOrders = [
      'id',
      'name',
      'type',
      'identification',
      'country_id',
      'city',
      'address',
      'postal_code',
      'verified',
      'id^',
      'name^',
      'type^',
      'identification^',
      'country_id^',
      'city^',
      'address^',
      'postal_code^',
      'verified^'
    ];
    const validLimitOffset = (
      isPositiveOrZeroInteger(query.offset) && isPositiveInteger(query.limit)
    );
    const queryCount = Object.keys(query).length;
    const validOrder = validOrders.some(item => item === query.order);
    const searchAndOrder = (query.search && validOrder);
    const searchOrOrder = (query.search || validOrder);

    return !(
      (queryCount !== 4 || !validLimitOffset || !searchAndOrder) &&
      (queryCount !== 3 || !validLimitOffset || !searchOrOrder) &&
      (queryCount !== 2 || !(validLimitOffset || searchAndOrder)) &&
      (queryCount !== 1 || !searchOrOrder)
    );
  }

  inject('isQueryValid', isQueryValid);
  context.$isQueryValid = isQueryValid;
}