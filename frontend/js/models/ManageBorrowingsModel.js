var ManageBorrowingsModel = {
  books: [],
  users: [],
  librarians: [],
  borrowings: [],
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

  loadBooks: function(successCallback, errorCallback) {
    RestClient.get('books', successCallback, errorCallback);
  },

  loadUsers: function(successCallback, errorCallback) {
    RestClient.get('users', successCallback, errorCallback);
  },

  loadLibrarians: function(successCallback, errorCallback) {
    RestClient.get('librarians', successCallback, errorCallback);
  },

  loadBorrowings: function(successCallback, errorCallback) {
    RestClient.get('borrowings', successCallback, errorCallback);
  },

  addBorrowing: function(formData, successCallback, errorCallback) {
    RestClient.post('borrowings', formData, successCallback, errorCallback);
  },

  getBorrowingById: function(borrowingId, successCallback, errorCallback) {
    RestClient.get('borrowings/' + borrowingId, successCallback, errorCallback);
  },

  updateBorrowing: function(borrowingId, updateData, successCallback, errorCallback) {
    RestClient.put('borrowings/' + borrowingId, updateData, successCallback, errorCallback);
  },

  returnBook: function(borrowingId, returnData, successCallback, errorCallback) {
    RestClient.put('borrowings/' + borrowingId + '/return', returnData, successCallback, errorCallback);
  },

  deleteBorrowing: function(borrowingId, successCallback, errorCallback) {
    RestClient.delete('borrowings/' + borrowingId, successCallback, errorCallback);
  },

  processDataResponse: function(response) {
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

  findBookById: function(bookId) {
    return this.books.find(function(b) { return b.id === bookId; });
  },

  findUserById: function(userId) {
    return this.users.find(function(u) { return u.id === userId; });
  },

  findLibrarianById: function(librarianId) {
    return this.librarians.find(function(l) { return l.id === librarianId; });
  }
};

window.ManageBorrowingsModel = ManageBorrowingsModel;