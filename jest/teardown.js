module.exports = function teardown() {
  this.global.__mockserver.kill();
};
