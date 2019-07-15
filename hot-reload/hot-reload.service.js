const chokidar = require('chokidar');
const chokidarConf = require('../chokidar.json');

function clearMemory() {
  Object.keys(require.cache).forEach((key) => {
    if(key.indexOf('node_modules') === -1) {
      const mod = require.cache[key];

      if(mod.parent) {
        const found = mod.parent.children.findIndex(item => mod === item);
        if(found) {
          mod.parent.children.splice(found, 1);
        }
      }

      delete require.cache[key];
    }
  });
  require.main.children.forEach(function(child, index) {
    if(child.id.indexOf('app/Server.js') > -1) {
      require.main.children.splice(index, 1);
    }
  });
}

function subscribe(callback) {
  chokidar.watch('app', chokidarConf).on('ready', function() {
    this.on('all', () => callback());
  });
  chokidar.watch('app/view/nuxt.config.js').on('ready', function() {
    this.on('all', () => callback(true));
  });
}


module.exports = {
  subscribe,
  clearMemory
};