function isString(string) {
  return !(typeof string !== 'string' && !(string instanceof String));
}

module.exports = {
  isString
};