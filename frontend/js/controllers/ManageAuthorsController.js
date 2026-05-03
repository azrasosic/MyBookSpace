var ManageAuthorsController = {
  authors: [],
  isInitialized: false,

  init: function() {
    if (!window.location.hash.includes('#manage-authors')) {
      this.isInitialized = false;
      return;
    }

    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (!ManageAuthorsModel.checkAuth()) {
      return;
    }

    this.setupFormValidations();
    this.loadAuthors();
  },

  setupFormValidations: function() {
    if (!$('#addAuthorForm').length) {
      console.error('Add Author Form not found!');
      return;
    }

    if (!$('#editAuthorForm').length) {
      console.error('Edit Author Form not found!');
      return;
    }

    $('#addAuthorForm').validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
          maxlength: 100
        },
        biography: {
          required: true,
          minlength: 10,
          maxlength: 2000
        }
      },
      messages: {
        name: {
          required: 'Please enter the author name',
          minlength: 'Author name must be at least 2 characters long',
          maxlength: 'Author name cannot exceed 100 characters'
        },
        biography: {
          required: 'Please enter the author biography',
          minlength: 'Biography must be at least 10 characters long',
          maxlength: 'Biography cannot exceed 2000 characters'
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
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Adding author...</h4>'
        });

        const formData = ManageAuthorsView.getFormData(form);
        ManageAuthorsModel.addAuthor(
          formData,
          function(response) {
            $.unblockUI();

            if (response && response.success) {
              toastr.success('Author added successfully.');

              $('#addAuthorModal').modal('hide');

              form.reset();
              $('#addAuthorForm').validate().resetForm();
              $('#addAuthorForm').find('.is-invalid').removeClass('is-invalid');

              setTimeout(function() {
                window.location.reload();
              }, 1500);
            } else {
              const errorMsg = response && response.error ? response.error : 'Failed to add author';
              toastr.error(errorMsg);
            }
          },
          function(error) {
            $.unblockUI();

            console.error('Add author error:', error);
            let errorMsg = 'Failed to add author';

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

    $('#editAuthorForm').validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
          maxlength: 100
        },
        biography: {
          required: true,
          minlength: 10,
          maxlength: 2000
        }
      },
      messages: {
        name: {
          required: 'Please enter the author name',
          minlength: 'Author name must be at least 2 characters long',
          maxlength: 'Author name cannot exceed 100 characters'
        },
        biography: {
          required: 'Please enter the author biography',
          minlength: 'Biography must be at least 10 characters long',
          maxlength: 'Biography cannot exceed 2000 characters'
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
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Updating author...</h4>'
        });

        const authorId = document.getElementById('editAuthorId')?.value;
        if (!authorId) {
          $.unblockUI();
          toastr.error('No author ID found for update!');
          return false;
        }

        const formData = ManageAuthorsView.getFormData(form);

        ManageAuthorsModel.updateAuthor(
          authorId,
          formData,
          function(response) {
            $.unblockUI();

            if (response && response.success) {
              toastr.success('Author updated successfully');

              $('#editAuthorModal').modal('hide');

              $('#editAuthorForm').validate().resetForm();
              $('#editAuthorForm').find('.is-invalid').removeClass('is-invalid');

              setTimeout(function() {
                ManageAuthorsController.loadAuthors();
              }, 1500);
            } else {
              const errorMsg = response && response.error ? response.error : 'Failed to update author';
              toastr.error(errorMsg);
            }
          },
          function(error) {
            $.unblockUI();

            console.error('Update author error:', error);
            let errorMsg = 'Failed to update author';

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
              errorMsg = 'Author not found';
            }

            toastr.error(errorMsg);
          }
        );

        return false;
      }
    });

    $('#addAuthorModal').on('hidden.bs.modal', function() {
      $('#addAuthorForm').validate().resetForm();
      $('#addAuthorForm').find('.is-invalid').removeClass('is-invalid');
    });

    $('#editAuthorModal').on('hidden.bs.modal', function() {
      $('#editAuthorForm').validate().resetForm();
      $('#editAuthorForm').find('.is-invalid').removeClass('is-invalid');
    });
  },

  loadAuthors: function() {
    ManageAuthorsView.showLoading();

    ManageAuthorsModel.loadAuthors(
      function(response) {
        this.authors = ManageAuthorsModel.processAuthorsResponse(response);
        if (this.authors.length === 0) {
          toastr.warning('No authors found in the database');
        }

        ManageAuthorsView.displayAuthors(this.authors);
      }.bind(this),
      function(error) {
        let errorMessage = 'Failed to load authors';
        if (error && error.status) {
          errorMessage += ' (Status: ' + error.status + ')';
        }
        if (error && error.responseJSON && error.responseJSON.error) {
          errorMessage += ': ' + error.responseJSON.error;
        }

        toastr.error(errorMessage);
        ManageAuthorsView.showError(errorMessage);
      }
    );
  },

  editAuthor: function(authorId) {
    $.blockUI({
      message: '<h4><i class="bi bi-hourglass-split me-2"></i>Loading author details...</h4>'
    });

    ManageAuthorsModel.getAuthorById(
      authorId,
      function(author) {
        $.unblockUI();
        ManageAuthorsView.showEditAuthorModal(author);
      },
      function(error) {
        $.unblockUI();
        toastr.error('Failed to load author details');
      }
    );
  },

  deleteAuthor: function(authorId) {
    if (!confirm('Are you sure you want to delete this author? This action cannot be undone.')) return;

    $.blockUI({
      message: '<h4><i class="bi bi-hourglass-split me-2"></i>Deleting author...</h4>'
    });

    ManageAuthorsModel.deleteAuthor(
      authorId,
      function(response) {
        $.unblockUI();
        if (response && (response.success === true || (response.message && response.message.includes('deleted')))) {
          toastr.success(response.message || 'Author deleted successfully');
          this.loadAuthors();
        } else {
          toastr.success('Author deleted successfully');
          this.loadAuthors();
        }
      }.bind(this),
      function(error) {
        $.unblockUI();
        console.error('Delete error:', error);

        if (error && (error.success === true || (error.message && error.message.includes('deleted')))) {
          toastr.success(error.message || 'Author deleted successfully');
          this.loadAuthors();
        } else {
          let errorMsg = error.responseJSON?.error || error.message || 'Failed to delete author';

          if (error.status === 404) {
            errorMsg = 'Author not found';
          } else if (error.status === 400) {
            errorMsg = 'Cannot delete author with associated books';
          }

          toastr.error(errorMsg);
        }
      }.bind(this)
    );
  }
};

window.ManageAuthorsController = ManageAuthorsController;