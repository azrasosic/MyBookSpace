var ManageBooksController = {
  authors: [],
  books: [],
  isInitialized: false,

  init: function() {
    if (!window.location.hash.includes('#manage-books')) {
      this.isInitialized = false;
      return;
    }

    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (!ManageBooksModel.checkAuth()) {
      return;
    }

    this.setupFormValidations();
    this.loadInitialData();
  },

  setupFormValidations: function() {
    if (!$('#addBookForm').length) {
      console.error('Add Book Form not found!');
      return;
    }

    if (!$('#editBookForm').length) {
      console.error('Edit Book Form not found!');
      return;
    }

    const currentYear = new Date().getFullYear();

    $('#addBookForm').validate({
      rules: {
        title: {
          required: true,
          minlength: 2,
          maxlength: 200
        },
        author_id: {
          required: true
        },
        ISBN: {
          required: true,
          maxlength: 20
        },
        publication_year: {
          required: true,
          number: true,
          min: 1000,
          max: currentYear,
          digits: true
        },
        genre: {
          required: true
        },
        summary: {
          required: true,
          minlength: 10,
          maxlength: 1000
        },
        status: {
          required: true
        },
        image_url: {
          required: true
        }
      },
      messages: {
        title: {
          required: 'Please enter the book title',
          minlength: 'Title must be at least 2 characters long',
          maxlength: 'Title cannot exceed 200 characters'
        },
        author_id: {
          required: 'Please select an author'
        },
        ISBN: {
          required: 'Please enter the ISBN',
          maxlength: 'ISBN cannot exceed 20 characters'
        },
        publication_year: {
          required: 'Please enter the publication year',
          number: 'Please enter a valid year',
          min: 'Year must be at least 1000',
          max: 'Publication year cannot be in the future',
          digits: 'Please enter a valid year (digits only)'
        },
        genre: {
          required: 'Please select a genre'
        },
        summary: {
          required: 'Please enter a summary',
          minlength: 'Summary must be at least 10 characters long',
          maxlength: 'Summary cannot exceed 1000 characters'
        },
        status: {
          required: 'Please select a status'
        },
        image_url: {
          required: 'Please enter an image URL'
        }
      },
      errorPlacement: function(error, element) {
        error.addClass('text-danger small mt-1 d-block');
        error.insertAfter(element);
      },
      highlight: function(element) {
        $(element).addClass('is-invalid');
        $(element).removeClass('is-valid');
      },
      unhighlight: function(element) {
        $(element).removeClass('is-invalid');
      },
      submitHandler: function(form) {
        $.blockUI({
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Adding book...</h4>'
        });

        const formData = ManageBooksView.getFormData(form);

        const pubYear = parseInt(formData.publication_year);
        if (pubYear > currentYear) {
          $.unblockUI();
          toastr.error('Publication year cannot be in the future');
          return false;
        }

        ManageBooksModel.addBook(
          formData,
          function(response) {
            $.unblockUI();

            if (response.success) {
              toastr.success('Book added successfully.');

              $('#addBookModal').modal('hide');

              form.reset();
              $('#addBookForm').validate().resetForm();
              $('#addBookForm').find('.is-invalid').removeClass('is-invalid');

              setTimeout(function() {
                window.location.reload();
              }, 1500);
            } else {
              toastr.error(response.error || 'Failed to add book');
            }
          },
          function(error) {
            $.unblockUI();

            console.error('Add book error:', error);
            let errorMsg = 'Failed to add book';

            if (error.responseJSON) {
              errorMsg = error.responseJSON.error || error.responseJSON.message || errorMsg;
            } else if (error.responseText) {
              try {
                const errorData = JSON.parse(error.responseText);
                errorMsg = errorData.error || errorData.message || errorMsg;
              } catch (e) {
                if (error.responseText.trim()) {
                  errorMsg = error.responseText;
                }
              }
            }

            toastr.error(errorMsg);
          }
        );

        return false;
      }
    });

    $('#editBookForm').validate({
      rules: {
        title: {
          required: true,
          minlength: 2,
          maxlength: 200
        },
        author_id: {
          required: true
        },
        ISBN: {
          required: true,
          maxlength: 20
        },
        publication_year: {
          required: true,
          number: true,
          min: 1000,
          max: currentYear,
          digits: true
        },
        genre: {
          required: true
        },
        summary: {
          required: true,
          minlength: 10,
          maxlength: 1000
        },
        status: {
          required: true
        },
        image_url: {
          required: true
        }
      },
      messages: {
        title: {
          required: 'Please enter the book title',
          minlength: 'Title must be at least 2 characters long',
          maxlength: 'Title cannot exceed 200 characters'
        },
        author_id: {
          required: 'Please select an author'
        },
        ISBN: {
          required: 'Please enter the ISBN',
          maxlength: 'ISBN cannot exceed 20 characters'
        },
        publication_year: {
          required: 'Please enter the publication year',
          number: 'Please enter a valid year',
          min: 'Year must be at least 1000',
          max: 'Publication year cannot be in the future',
          digits: 'Please enter a valid year (digits only)'
        },
        genre: {
          required: 'Please select a genre'
        },
        summary: {
          required: 'Please enter a summary',
          minlength: 'Summary must be at least 10 characters long',
          maxlength: 'Summary cannot exceed 1000 characters'
        },
        status: {
          required: 'Please select a status'
        },
        image_url: {
          required: 'Please enter an image URL'
        }
      },
      errorPlacement: function(error, element) {
        error.addClass('text-danger small mt-1 d-block');
        error.insertAfter(element);
      },
      highlight: function(element) {
        $(element).addClass('is-invalid');
        $(element).removeClass('is-valid');
      },
      unhighlight: function(element) {
        $(element).removeClass('is-invalid');
      },
      submitHandler: function(form) {
        $.blockUI({
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Updating book...</h4>'
        });

        const bookId = document.getElementById('editBookId')?.value;
        if (!bookId) {
          $.unblockUI();
          toastr.error('No book ID found for update!');
          return false;
        }

        const formData = ManageBooksView.getFormData(form);

        const pubYear = parseInt(formData.publication_year);
        if (pubYear > currentYear) {
          $.unblockUI();
          toastr.error('Publication year cannot be in the future');
          return false;
        }

        ManageBooksModel.updateBook(
          bookId,
          formData,
          function(response) {
            $.unblockUI();

            if (response.success) {
              toastr.success('Book updated successfully');

              $('#editBookModal').modal('hide');

              $('#editBookForm').validate().resetForm();
              $('#editBookForm').find('.is-invalid').removeClass('is-invalid');

              ManageBooksController.loadBooks();
            } else {
              toastr.error(response.error || 'Failed to update book');
            }
          },
          function(error) {
            $.unblockUI();

            console.error('Update book error:', error);
            let errorMsg = 'Failed to update book';

            if (error.responseJSON) {
              errorMsg = error.responseJSON.error || error.responseJSON.message || errorMsg;
            } else if (error.responseText) {
              try {
                const errorData = JSON.parse(error.responseText);
                errorMsg = errorData.error || errorData.message || errorMsg;
              } catch (e) {
                if (error.responseText.trim()) {
                  errorMsg = error.responseText;
                }
              }
            } else if (error.status === 404) {
              errorMsg = 'Book not found';
            }

            toastr.error(errorMsg);
          }
        );

        return false;
      }
    });

    $('#addBookModal').on('hidden.bs.modal', function() {
      $('#addBookForm').validate().resetForm();
      $('#addBookForm').find('.is-invalid').removeClass('is-invalid');
    });

    $('#editBookModal').on('hidden.bs.modal', function() {
      $('#editBookForm').validate().resetForm();
      $('#editBookForm').find('.is-invalid').removeClass('is-invalid');
    });

    $('#addBookModal').on('show.bs.modal', function() {
      this.populateAddModalAuthors();
    }.bind(this));
  },

  loadInitialData: function() {
    ManageBooksView.showLoading();

    ManageBooksModel.loadAuthors(
      function(response) {
        this.authors = ManageBooksModel.processAuthorsResponse(response);
        this.loadBooks();
      }.bind(this),
      function(error) {
        toastr.error('Failed to load authors');
        ManageBooksView.showError('Could not load authors data');
      }
    );
  },

  loadBooks: function() {
    ManageBooksView.showLoading();

    ManageBooksModel.loadBooks(
      function(response) {
        this.books = ManageBooksModel.processBooksResponse(response);
        ManageBooksView.displayBooks(this.books, this.authors);
      }.bind(this),
      function(error) {
        toastr.error('Failed to load books');
        ManageBooksView.showError('Could not load books');
      }
    );
  },

  populateAddModalAuthors: function() {
    if (this.authors && this.authors.length > 0) {
      ManageBooksView.populateAuthorsDropdown('bookAuthor', this.authors, null);
    } else {
      ManageBooksModel.loadAuthors(
        function(response) {
          this.authors = ManageBooksModel.processAuthorsResponse(response);
          ManageBooksView.populateAuthorsDropdown('bookAuthor', this.authors, null);
        }.bind(this),
        function(error) {
          ManageBooksView.populateAuthorsDropdown('bookAuthor', [], null);
        }
      );
    }
  },

  editBook: function(bookId) {
    $.blockUI({
      message: '<h4><i class="bi bi-hourglass-split me-2"></i>Loading book details...</h4>'
    });

    ManageBooksModel.getBookById(
      bookId,
      function(book) {
        $.unblockUI();
        ManageBooksView.showEditBookModal(book, this.authors);
      }.bind(this),
      function(error) {
        $.unblockUI();
        toastr.error('Failed to load book details');
      }
    );
  },

  deleteBook: function(bookId) {
    const bookToDelete = this.books.find(function(book) { return book.id == bookId; });

    if (bookToDelete) {
      if (bookToDelete.status && bookToDelete.status.toLowerCase() === 'borrowed') {
        toastr.error('Cannot delete a book that is currently borrowed');
        return;
      }
    }

    if (!confirm('Are you sure you want to delete this book?')) return;

    $.blockUI({
      message: '<h4><i class="bi bi-hourglass-split me-2"></i>Deleting book...</h4>'
    });

    ManageBooksModel.deleteBook(
      bookId,
      function(response) {
        $.unblockUI();
        if (response && (response.success === true || response.message === 'Book deleted successfully')) {
          toastr.success(response.message || 'Book deleted successfully');
          this.loadBooks();
        } else {
          toastr.success('Book deleted successfully');
          this.loadBooks();
        }
      }.bind(this),
      function(error) {
        $.unblockUI();
        console.error('Delete error:', error);

        let errorMsg = 'Failed to delete book';

        if (error && error.message === 'Book deleted successfully') {
          toastr.success('Book deleted successfully');
          this.loadBooks();
        } else if (error && error.success === true) {
          toastr.success(error.message || 'Book deleted successfully');
          this.loadBooks();
        } else {
          if (error.responseJSON) {
            errorMsg = error.responseJSON.error || error.responseJSON.message || errorMsg;
          } else if (error.responseText) {
            try {
              const errorData = JSON.parse(error.responseText);
              errorMsg = errorData.error || errorData.message || errorMsg;
            } catch (e) {
              if (error.responseText.trim()) {
                errorMsg = error.responseText;
              }
            }
          } else if (error.status === 404) {
            errorMsg = 'Book not found';
          } else if (error.status === 400) {
            errorMsg = 'Cannot delete a book that is currently borrowed';
          }

          toastr.error(errorMsg);
        }
      }.bind(this)
    );
  }
};

window.ManageBooksController = ManageBooksController;