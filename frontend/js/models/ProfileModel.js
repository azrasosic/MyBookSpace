var ProfileModel = {
  authorCache: {},

  loadUserProfile: function(userId, userRole, successCallback, errorCallback) {
    var endpoint;
    if (userRole.toLowerCase() === 'librarian') {
      endpoint = 'librarians/' + userId;
    } else {
      endpoint = 'users/' + userId;
    }

    RestClient.get(endpoint, successCallback, errorCallback);
  },

  loadCurrentUserProfile: function(successCallback, errorCallback) {
    RestClient.get('profile', successCallback, errorCallback);
  },

  updateProfile: function(userId, userRole, formData, successCallback, errorCallback) {
    var endpoint;
    if (userRole.toLowerCase() === 'librarian') {
      endpoint = 'librarians/' + userId + '/profile';
    } else {
      endpoint = 'users/' + userId + '/profile';
    }

    RestClient.patch(endpoint, formData, successCallback, errorCallback);
  },

  changePassword: function(userId, userRole, passwordData, successCallback, errorCallback) {
    var endpoint;
    if (userRole.toLowerCase() === 'librarian') {
      endpoint = 'librarians/' + userId + '/password';
    } else {
      endpoint = 'users/' + userId + '/password';
    }

    RestClient.put(endpoint, passwordData, successCallback, errorCallback);
  },

  loadBorrowingHistory: function(userId, successCallback, errorCallback) {
    RestClient.get('users/' + userId + '/borrowing-history', successCallback, errorCallback);
  },

  fetchAuthorName: function(authorId, successCallback, errorCallback) {
    if (this.authorCache[authorId]) {
      successCallback(this.authorCache[authorId]);
      return;
    }

    RestClient.get('authors/' + authorId,
      function(response) {
        var authorName = 'Unknown Author';

        if (response && typeof response === 'object') {
          if (response.success && response.data) {
            authorName = response.data.name || response.data.author_name || authorName;
          } else if (response.name) {
            authorName = response.name;
          } else if (response.author_name) {
            authorName = response.author_name;
          }
        }

        this.authorCache[authorId] = authorName;
        successCallback(authorName);
      }.bind(this),
      function(error) {
        this.authorCache[authorId] = 'Unknown Author';
        successCallback('Unknown Author');
      }.bind(this)
    );
  }
};

window.ProfileModel = ProfileModel;