var ManageBooksModel = {
  authors: [],
  books: [],
  currentUserId: null,
  currentUserRole: null,

  checkAuth: function() {
    const token = localStorage.getItem('user_token');

    if (!token) {
      toastr.error('Please log in to access admin dashboard');
      window.location.href = '#login';
      return false;
    }

    try {
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

  loadAuthors: function(successCallback, errorCallback) {
    RestClient.get('authors', successCallback, errorCallback);
  },

  addBook: function(formData, successCallback, errorCallback) {
    RestClient.post('books', formData, successCallback, errorCallback);
  },

  getBookById: function(bookId, successCallback, errorCallback) {
    RestClient.get('books/' + bookId, successCallback, errorCallback);
  },

  updateBook: function(bookId, formData, successCallback, errorCallback) {
    RestClient.put('books/' + bookId, formData, successCallback, errorCallback);
  },

  deleteBook: function(bookId, successCallback, errorCallback) {
    RestClient.delete('books/' + bookId, successCallback, errorCallback);
  },

  processBooksResponse: function(response) {
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

  processAuthorsResponse: function(response) {
    return this.processBooksResponse(response);
  },

  getAuthorName: function(book, authors) {
    if (book.author_name) {
      return book.author_name;
    } else if (book.author && book.author.name) {
      return book.author.name;
    } else if (book.author_id) {
      var author = authors.find(function(a) { return a.id === book.author_id; });
      return author ? author.name : 'Unknown';
    }
    return 'Unknown';
  }
};

window.ManageBooksModel = ManageBooksModel;