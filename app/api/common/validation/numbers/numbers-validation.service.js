function parseStrictInt(variable) {
  if(/^(\-|\+)?([0-9]+|Infinity)$/.test(variable)) {
    return Number(variable);
  }
  return NaN;
}
function parseStrictFloat(variable) {
  if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(variable)) {
    return Number(variable);
  }
  return NaN;
}

function isInteger(variable) {
  return !isNaN(parseStrictInt(variable));
}
function isPositiveInteger(variable) {
  const parsed = parseStrictInt(variable);

  return !isNaN(parsed) && parsed > 0;
}
function isPositiveOrZeroInteger(variable) {
  const parsed = parseStrictInt(variable);

  return !isNaN(parsed) && parsed >= 0;
}
function isFloat(variable) {
  return !isNaN(parseStrictFloat(variable));
}

module.exports = {
  isInteger,
  isPositiveInteger,
  isPositiveOrZeroInteger,
  isFloat
};