function transform(data) {
  const prepared = {};

  Object.keys(data).forEach(function (key) {
    prepared[key.split('_').map((item, index) => {
      if(index !== 0) {
        item = item.charAt(0).toLocaleUpperCase() + item.slice(1);
      }
      return item;
    }).join('')] = data[key];
  });

  return prepared;
}
function transformArray(data) {
  return data.map(transform);
}

module.exports = {
  transform,
  transformArray
};