function isArray(array) {
  if (!Array.isArray) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(array);
}

module.exports = {
  isArray
};