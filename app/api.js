module.exports = function api(app) {
  require('./api/pubNub')(app);
}
