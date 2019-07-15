let memory;
let persistence;

function inject(database) {
  memory = database.memory;
  persistence = database.persistence;
}
function get() {
  return {
    memory,
    persistence
  };
}

module.exports = {
  inject,
  get
};