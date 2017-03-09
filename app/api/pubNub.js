module.exports = function pubNub(app) {
  require('./pubNub/auth')(app);
}
