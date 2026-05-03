var ManageBorrowingsController = {
  books: [],
  users: [],
  librarians: [],
  borrowings: [],
  isInitialized: false,

  init: function() {
    if (!window.location.hash.includes('#manage-borrowings')) {
      this.isInitialized = false;
      return;
    }

    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (!ManageBorrowingsModel.checkAuth()) {
      return;
    }

    this.setupFormValidations();
    this.loadData();
  },

  setupFormValidations: function() {
    if (!$('#addBorrowingForm').length) {
      console.error('Add Borrowing Form not found!');
      return;
    }

    if (!$('#editBorrowingForm').length) {
      console.error('Edit Borrowing Form not found!');
      return;
    }

    $('#addBorrowingForm').validate({
      rules: {
        book_id: {
          required: true
        },
        user_id: {
          required: true
        }
      },
      messages: {
        book_id: {
          required: 'Please select a book'
        },
        user_id: {
          required: 'Please select a user'
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
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Creating borrowing...</h4>'
        });

        const formData = ManageBorrowingsView.getFormData(form);
        formData.librarian_id = ManageBorrowingsModel.currentUserId;

        const selectedBook = ManageBorrowingsController.books.find(function(b) { return b.id == formData.book_id; });
        if (selectedBook && selectedBook.status !== 'Available') {
          $.unblockUI();
          toastr.error('Selected book is not available for borrowing');
          return false;
        }

        ManageBorrowingsModel.addBorrowing(
          formData,
          function(response) {
            $.unblockUI();

            if (response && response.success) {
              toastr.success('Borrowing created successfully.');

              $('#addBorrowingModal').modal('hide');

              form.reset();
              $('#addBorrowingForm').validate().resetForm();
              $('#addBorrowingForm').find('.is-invalid').removeClass('is-invalid');

              setTimeout(function() {
                window.location.reload();
              }, 1500);
            } else {
              const errorMsg = response && response.error ? response.error : 'Failed to create borrowing';
              toastr.error(errorMsg);
            }
          },
          function(error) {
            $.unblockUI();

            console.error('Add borrowing error:', error);
            let errorMsg = 'Failed to create borrowing';

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

    $('#editBorrowingForm').validate({
      rules: {
        status: {
          required: true
        },
        return_date: {
          requiredWhenReturned: true
        }
      },
      messages: {
        status: {
          required: 'Please select a status'
        },
        return_date: {
          requiredWhenReturned: 'Return date is required.'
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
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Updating borrowing...</h4>'
        });

        const borrowingId = document.getElementById('editBorrowingId')?.value;
        if (!borrowingId) {
          $.unblockUI();
          toastr.error('No borrowing ID found for update!');
          return false;
        }

        const status = document.getElementById('editBorrowingStatus').value;
        const returnDate = document.getElementById('editBorrowingReturnDate').value;
        const borrowDateDisplay = document.getElementById('editBorrowingBorrowDateDisplay').value;

        if (status === 'Returned') {
          if (!returnDate) {
            $.unblockUI();
            toastr.error('Return date is required when marking as Returned');
            return false;
          }

          if (borrowDateDisplay) {
            const borrowDate = new Date(borrowDateDisplay);
            const returnDateObj = new Date(returnDate);

            if (returnDateObj < borrowDate) {
              $.unblockUI();
              toastr.error('Return date cannot be before borrow date');
              return false;
            }
          }
        }

        if (status === 'Returned') {
          ManageBorrowingsModel.returnBook(
            borrowingId,
            { return_date: returnDate },
            function(response) {
              $.unblockUI();

              if (response && response.success) {
                toastr.success('Book returned successfully');

                $('#editBorrowingModal').modal('hide');

                $('#editBorrowingForm').validate().resetForm();
                $('#editBorrowingForm').find('.is-invalid').removeClass('is-invalid');

                ManageBorrowingsController.loadBorrowings();
              } else {
                const errorMsg = response && response.error ? response.error : 'Failed to return book';
                toastr.error(errorMsg);
              }
            },
            function(error) {
              $.unblockUI();

              console.error('Return book error:', error);
              let errorMsg = 'Failed to return book';

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
        } else {
          const updateData = {
            return_date: returnDate || null,
            status: status
          };

          ManageBorrowingsModel.updateBorrowing(
            borrowingId,
            updateData,
            function(response) {
              $.unblockUI();

              if (response && response.success) {
                toastr.success('Borrowing updated successfully');

                $('#editBorrowingModal').modal('hide');

                $('#editBorrowingForm').validate().resetForm();
                $('#editBorrowingForm').find('.is-invalid').removeClass('is-invalid');

                ManageBorrowingsController.loadBorrowings();
              } else {
                const errorMsg = response && response.error ? response.error : 'Failed to update borrowing';
                toastr.error(errorMsg);
              }
            },
            function(error) {
              $.unblockUI();

              console.error('Update borrowing error:', error);
              let errorMsg = 'Failed to update borrowing';

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
        }

        return false;
      }
    });

    $.validator.addMethod('requiredWhenReturned', function(value, element) {
      const status = $('#editBorrowingStatus').val();
      if (status === 'Returned') {
        return value.trim() !== '';
      }
      return true;
    }, 'Return date is required when marking as Returned');

    $('#editBorrowingStatus').on('change', function() {
      const status = $(this).val();
      const returnDateField = $('#editBorrowingReturnDate');

      if (status === 'Returned') {
        returnDateField.prop('required', true);
        returnDateField.closest('.mb-3').find('.form-text').show();
      } else {
        returnDateField.prop('required', false);
        returnDateField.closest('.mb-3').find('.form-text').hide();
      }

      $('#editBorrowingForm').validate().element(returnDateField);
    });

    $('#addBorrowingModal').on('hidden.bs.modal', function() {
      $('#addBorrowingForm').validate().resetForm();
      $('#addBorrowingForm').find('.is-invalid').removeClass('is-invalid');
    });

    $('#editBorrowingModal').on('hidden.bs.modal', function() {
      $('#editBorrowingForm').validate().resetForm();
      $('#editBorrowingForm').find('.is-invalid').removeClass('is-invalid');
      $('#editBorrowingReturnDate').prop('required', false);
      $('#editBorrowingReturnDate').closest('.mb-3').find('.form-text').show();
    });

    $('#addBorrowingModal').on('show.bs.modal', function() {
      this.populateAddModalDropdowns();
    }.bind(this));
  },

  loadData: function() {
    ManageBorrowingsView.showLoading();

    this.loadBooks(function() {
      this.loadUsers(function() {
        this.loadLibrarians(function() {
          this.loadBorrowings();
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  loadBooks: function(callback) {
    ManageBorrowingsModel.loadBooks(
      function(response) {
        this.books = ManageBorrowingsModel.processDataResponse(response);
        if (callback) callback();
      }.bind(this),
      function(error) {
        toastr.error('Failed to load books');
        if (callback) callback();
      }
    );
  },

  loadUsers: function(callback) {
    ManageBorrowingsModel.loadUsers(
      function(response) {
        this.users = ManageBorrowingsModel.processDataResponse(response);
        if (callback) callback();
      }.bind(this),
      function(error) {
        toastr.error('Failed to load users');
        if (callback) callback();
      }
    );
  },

  loadLibrarians: function(callback) {
    ManageBorrowingsModel.loadLibrarians(
      function(response) {
        this.librarians = ManageBorrowingsModel.processDataResponse(response);
        if (callback) callback();
      }.bind(this),
      function(error) {
        toastr.error('Failed to load librarians');
        if (callback) callback();
      }
    );
  },

  loadBorrowings: function() {
    ManageBorrowingsModel.loadBorrowings(
      function(response) {
        this.borrowings = ManageBorrowingsModel.processDataResponse(response);
        ManageBorrowingsView.displayBorrowings(this.borrowings, this.books, this.users, this.librarians);
      }.bind(this),
      function(error) {
        toastr.error('Failed to load borrowings');
        ManageBorrowingsView.showError('Failed to load borrowings');
      }
    );
  },

  populateAddModalDropdowns: function() {
    if (this.books && this.books.length > 0) {
      ManageBorrowingsView.populateBooksDropdown('borrowingBook', this.books, null);
    } else {
      ManageBorrowingsModel.loadBooks(
        function(response) {
          this.books = ManageBorrowingsModel.processDataResponse(response);
          ManageBorrowingsView.populateBooksDropdown('borrowingBook', this.books, null);
        }.bind(this),
        function(error) {
          console.error('Failed to load books for modal:', error);
          ManageBorrowingsView.populateBooksDropdown('borrowingBook', [], null);
        }
      );
    }

    if (this.users && this.users.length > 0) {
      ManageBorrowingsView.populateUsersDropdown('borrowingUser', this.users, null);
    } else {
      ManageBorrowingsModel.loadUsers(
        function(response) {
          this.users = ManageBorrowingsModel.processDataResponse(response);
          ManageBorrowingsView.populateUsersDropdown('borrowingUser', this.users, null);
        }.bind(this),
        function(error) {
          console.error('Failed to load users for modal:', error);
          ManageBorrowingsView.populateUsersDropdown('borrowingUser', [], null);
        }
      );
    }
  },

  editBorrowing: function(borrowingId) {
    $.blockUI({
      message: '<h4><i class="bi bi-hourglass-split me-2"></i>Loading borrowing details...</h4>'
    });

    ManageBorrowingsModel.getBorrowingById(
      borrowingId,
      function(borrowing) {
        $.unblockUI();
        ManageBorrowingsView.showEditBorrowingModal(borrowing, this.books, this.users);
      }.bind(this),
      function(error) {
        $.unblockUI();
        toastr.error('Failed to load borrowing details');
      }
    );
  },

  deleteBorrowing: function(borrowingId) {
    const borrowingToDelete = this.borrowings.find(function(borrowing) { return borrowing.id == borrowingId; });

    if (borrowingToDelete) {
      const displayStatus = ManageBorrowingsView.getDisplayStatus(borrowingToDelete).toLowerCase();
      const status = borrowingToDelete.status ? borrowingToDelete.status.toLowerCase() : '';

      const isActive = status === 'active' ||
        status === 'borrowed' ||
        displayStatus === 'overdue' ||
        (!borrowingToDelete.return_date && borrowingToDelete.status &&
        (borrowingToDelete.status.toLowerCase().includes('active') ||
        borrowingToDelete.status.toLowerCase().includes('borrowed')));

      if (isActive) {
        toastr.error('Cannot delete an active borrowing. Please return the book first.');
        return;
      }
    }

    if (!confirm('Are you sure you want to delete this borrowing record?')) return;

    $.blockUI({
      message: '<h4><i class="bi bi-hourglass-split me-2"></i>Deleting borrowing...</h4>'
    });

    ManageBorrowingsModel.deleteBorrowing(
      borrowingId,
      function(response) {
        $.unblockUI();
        if (response && (response.success === true || (response.message && response.message.includes('deleted')))) {
          toastr.success(response.message || 'Borrowing record deleted successfully');
          this.loadBorrowings();
        } else {
          toastr.success('Borrowing record deleted successfully');
          this.loadBorrowings();
        }
      }.bind(this),
      function(error) {
        $.unblockUI();
        console.error('Delete error:', error);

        if (error && (error.success === true || (error.message && error.message.includes('deleted')))) {
          toastr.success(error.message || 'Borrowing record deleted successfully');
          this.loadBorrowings();
        } else {
          let errorMsg = error.responseJSON?.error || error.message || 'Failed to delete borrowing';

          if (error.status === 404) {
            errorMsg = 'Borrowing not found';
          } else if (error.status === 400) {
            errorMsg = 'Cannot delete this borrowing record';
          }

          toastr.error(errorMsg);
        }
      }.bind(this)
    );
  }
};

window.ManageBorrowingsController = ManageBorrowingsController;