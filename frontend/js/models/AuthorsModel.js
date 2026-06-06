var AuthorsModel = {
  loadAll: function(successCallback, errorCallback) {
    RestClient.get('authors', successCallback, errorCallback);
  },

  loadById: function(authorId, successCallback, errorCallback) {
    RestClient.get('authors/' + authorId, successCallback, errorCallback);
  },

  loadBooksByAuthor: function(authorId, successCallback, errorCallback) {
    RestClient.get('authors/' + authorId + '/books', successCallback, errorCallback);
  }
};

window.AuthorsModel = AuthorsModel;