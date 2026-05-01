var BookController = {
  init: function() {
    this.setupGenreFilter();
    this.setupBookDetails();
    this.loadBooks();
  },

  setupGenreFilter: function() {
    if (!$('#book-filter').length) {
      return;
    }

    $('.genre-filter-btn').off('click').on('click', function() {
      $('.genre-filter-btn').removeClass('active');
      $(this).addClass('active');

      const genre = $(this).data('genre');
      BookController.loadBooks(genre);
    });
    $('.genre-filter-btn[data-genre=""]').addClass('active');
  },

  setupBookDetails: function() {
    $(document).off('click', '.book-details-link').on('click', '.book-details-link', function(e) {
      e.preventDefault();
      const bookId = $(this).data('book-id');
      localStorage.setItem('currentBookId', bookId);
      window.location.hash = 'book-details';

      setTimeout(function() {
        BookController.loadBookDetails();
      }, 100);
    });
  },

  loadBooks: function(genre = null) {
    BookModel.loadBooks(
      genre,
      function(response) {
        if (Array.isArray(response)) {
          BookView.displayBooks(response);
        } else if (response && typeof response === 'object') {
          if (response.success !== undefined) {
            if (response.success) {
              BookView.displayBooks(response.data || []);
            } else {
              toastr.error(response.error || 'Failed to load books');
              BookView.showError(response.error || 'API returned error');
            }
          } else if (response.data !== undefined) {
            BookView.displayBooks(Array.isArray(response.data) ? response.data : [response.data]);
          } else {
            BookView.displayBooks(response);
          }
        } else {
          BookView.showError('Invalid response format from server');
        }
      },
      function(xhr) {
        let errorMessage = 'Failed to load books';
        if (xhr.responseText) {
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.error || errorData.message || xhr.responseText;
          } catch (e) {
            errorMessage = xhr.responseText;
          }
        }

        if (xhr.status === 401) {
          toastr.error('Please log in to continue');
          setTimeout(function() {
            window.location.href = '#login';
          }, 1000);
          return;
        }

        BookView.showError(errorMessage);
        toastr.error(errorMessage);
      }
    );
  },

  loadBookDetails: function() {
    const bookId = localStorage.getItem('currentBookId');
    if (!bookId || isNaN(bookId)) {
      $('#book-details-container').html(
        '<div class="alert alert-danger">' +
          '<h4>Error: Invalid book selection</h4>' +
          '<a href="#books" class="btn btn-primary">Return to Books</a>' +
        '</div>'
      );
      return;
    }

    $('#book-details-container').html(
      '<div class="text-center py-5">' +
        '<div class="spinner-border text-primary" role="status">' +
          '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '<p>Loading book details...</p>' +
      '</div>'
    );

    BookModel.loadBookDetails(
      bookId,
      function(book) {
        BookView.renderBookDetails(book);
      },
      function(xhr) {
        let errorMessage = 'Error loading book details';
        if (xhr.responseText) {
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.error || errorData.message || xhr.responseText;
          } catch (e) {
            errorMessage = xhr.responseText;
          }
        }

        if (xhr.status === 401) {
          toastr.error('Session expired. Please log in again.');
          setTimeout(function() {
            window.location.href = '#login';
          }, 1000);
          return;
        }

        $('#book-details-container').html(
          '<div class="alert alert-danger">' +
            '<h4>Error loading book</h4>' +
            '<p>' + errorMessage + '</p>' +
            '<a href="#books" class="btn btn-primary">Back to Books</a>' +
          '</div>'
        );
      }
    );
  }
};

window.BookController = BookController;