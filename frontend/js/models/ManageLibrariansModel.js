var ManageLibrariansModel = {
  librarians: [],
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

  loadLibrarians: function(successCallback, errorCallback) {
    RestClient.get('librarians', successCallback, errorCallback);
  },

  addLibrarian: function(formData, successCallback, errorCallback) {
    RestClient.post('librarians', formData, successCallback, errorCallback);
  },

  deleteLibrarian: function(librarianId, successCallback, errorCallback) {
    RestClient.delete('librarians/' + librarianId, successCallback, errorCallback);
  },

  processLibrariansResponse: function(response) {
    if (Array.isArray(response)) {
      return response;
    } else if (response && typeof response === 'object') {
      if (response.success && response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else if (response.data) {
        return Array.isArray(response.data) ? response.data : [response.data];
      } else {
        return [response];
      }
    }
    return [];
  },

  validateEmail: function(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

window.ManageLibrariansModel = ManageLibrariansModel;