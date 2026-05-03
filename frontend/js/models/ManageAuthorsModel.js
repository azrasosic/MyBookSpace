var ManageAuthorsModel = {
  authors: [],
  currentUserId: null,
  currentUserRole: null,

  checkAuth: function() {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        toastr.error('Please log in to access admin dashboard');
        window.location.href = '#login';
        return false;
      }

      const decoded = Utils.parseJwt(token);

      if (!decoded || !decoded.user) {
        toastr.error('Invalid user data in token');
        window.location.href = '#login';
        return false;
      }

      this.currentUserId = decoded.user.id;
      this.currentUserRole = decoded.user.role || '';

      if (this.currentUserRole.toLowerCase() !== 'librarian') {
        toastr.error('Access denied. Librarian role required.');
        window.location.href = '#profile';
        return false;
      }

      return true;

    } catch (e) {
      toastr.error('Invalid session');
      window.location.href = '#login';
      return false;
    }
  },

  loadAuthors: function(successCallback, errorCallback) {
    RestClient.get('authors', successCallback, errorCallback);
  },

  addAuthor: function(formData, successCallback, errorCallback) {
    RestClient.post('authors', formData, successCallback, errorCallback);
  },

  getAuthorById: function(authorId, successCallback, errorCallback) {
    RestClient.get('authors/' + authorId, successCallback, errorCallback);
  },

  updateAuthor: function(authorId, formData, successCallback, errorCallback) {
    RestClient.put('authors/' + authorId, formData, successCallback, errorCallback);
  },

  deleteAuthor: function(authorId, successCallback, errorCallback) {
    RestClient.delete('authors/' + authorId, successCallback, errorCallback);
  },

  processAuthorsResponse: function(response) {
    if (!response) return [];

    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object') {
      if (response.success !== undefined) {
        if (response.success && response.data) {
          return Array.isArray(response.data) ? response.data : [response.data];
        } else if (response.data) {
          return Array.isArray(response.data) ? response.data : [response.data];
        } else {
          return [response];
        }
      } else if (response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return [response];
      }
    }
    return [];
  }
};

window.ManageAuthorsModel = ManageAuthorsModel;