module.exports = function load(pubSubProvider) {
  return require('./pubSub/pubNubProvider')(pubSubProvider);
}
