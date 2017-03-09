module.exports = function load(suggestorProvider, intentProvider) {
  return require('./suggestionEngine/apiAiSuggestionEngine')(suggestorProvider, intentProvider);
  // return require('./suggestionEngine/customEngine')();
}
