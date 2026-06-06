var BookModel = {
  books: [],
  currentBook: null,

  loadBooks: function(genre, successCallback, errorCallback) {
    var token = localStorage.getItem('user_token');

    if (!token) {
      toastr.error('Please log in to view books');
      window.location.href = '#login';
      if (errorCallback) errorCallback({ status: 401 });
      return;
    }

    try {
      var decoded = Utils.parseJwt(token);
      var currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('user_token');
        toastr.error('Session expired. Please log in again.');
        window.location.href = '#login';
        if (errorCallback) errorCallback({ status: 401 });
        return;
      }
    } catch (e) {
      localStorage.removeItem('user_token');
      toastr.error('Invalid session. Please log in again.');
      window.location.href = '#login';
      if (errorCallback) errorCallback({ status: 401 });
      return;
    }

    var url = 'books';
    if (genre && genre !== '') {
      url = 'books/genre/' + encodeURIComponent(genre);
    }

    RestClient.get(url, successCallback, errorCallback);
  },

  loadBookDetails: function(bookId, successCallback, errorCallback) {
    var token = localStorage.getItem('user_token');
    if (!token) {
      toastr.error('Please log in to view book details');
      window.location.href = '#login';
      if (errorCallback) errorCallback({ status: 401 });
      return;
    }

    RestClient.get('books/' + bookId, successCallback, errorCallback);
  }
};

window.BookModel = BookModel;