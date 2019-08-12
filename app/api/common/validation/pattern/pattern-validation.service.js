function isValid(text, pattern) {
  return (new RegExp(pattern).test(text));
}

module.exports = {
  isValid
};