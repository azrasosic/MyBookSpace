var ManageLibrariansController = {
  librarians: [],
  isInitialized: false,

  init: function() {
    if (!window.location.hash.includes('#manage-librarians')) {
      this.isInitialized = false;
      return;
    }

    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (!ManageLibrariansModel.checkAuth()) {
      return;
    }

    this.setupFormValidations();
    this.loadLibrarians();
  },

  setupFormValidations: function() {
    if (!$('#addLibrarianForm').length) {
      console.error('Add Librarian Form not found!');
      return;
    }

    const today = new Date();
    const maxBirthDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const minBirthDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    const maxBirthDateStr = maxBirthDate.toISOString().split('T')[0];
    const minBirthDateStr = minBirthDate.toISOString().split('T')[0];

    $('#addLibrarianForm').validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
          maxlength: 50
        },
        surname: {
          required: true,
          minlength: 2,
          maxlength: 50
        },
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 8,
          maxlength: 20
        },
        date_of_birth: {
          required: true,
          date: true,
          min: minBirthDateStr,
          max: maxBirthDateStr
        },
        phone: {
          required: true,
          minlength: 6,
          maxlength: 15
        }
      },
      messages: {
        name: {
          required: 'Please enter the librarian name',
          minlength: 'Name must be at least 2 characters long',
          maxlength: 'Name cannot exceed 50 characters'
        },
        surname: {
          required: 'Please enter the librarian surname',
          minlength: 'Surname must be at least 2 characters long',
          maxlength: 'Surname cannot exceed 50 characters'
        },
        email: {
          required: 'Please enter the email address',
          email: 'Please enter a valid email address'
        },
        password: {
          required: 'Please enter a password',
          minlength: 'Password must be at least 8 characters long',
          maxlength: 'Password cannot exceed 20 characters'
        },
        date_of_birth: {
          required: 'Please enter the date of birth',
          date: 'Please enter a valid date',
          min: 'Librarian must be at least 18 years old',
          max: 'Date of birth cannot be in the future'
        },
        phone: {
          required: 'Please enter the phone number',
          minlength: 'Phone number must be at least 6 digits',
          maxlength: 'Phone number cannot exceed 15 digits'
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
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Adding librarian...</h4>'
        });

        const formData = ManageLibrariansView.getFormData(form);
        if (formData.phone) {
          formData.phone = formData.phone.replace(/[^\d+]/g, '');
        }

        formData.employment_date = new Date().toISOString().split('T')[0];

        ManageLibrariansModel.addLibrarian(
          formData,
          function(response) {
            $.unblockUI();

            if (response && response.success) {
              toastr.success('Librarian added successfully. Refreshing...');

              $('#addLibrarianModal').modal('hide');

              form.reset();
              $('#addLibrarianForm').validate().resetForm();
              $('#addLibrarianForm').find('.is-invalid').removeClass('is-invalid');

              setTimeout(function() {
                window.location.reload();
              }, 1500);
            } else {
              const errorMsg = response && response.error ? response.error : 'Failed to add librarian';
              toastr.error(errorMsg);
            }
          },
          function(error) {
            $.unblockUI();

            console.error('Add librarian error:', error);
            let errorMsg = 'Failed to add librarian';

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

    $('#addLibrarianModal').on('hidden.bs.modal', function() {
      $('#addLibrarianForm').validate().resetForm();
      $('#addLibrarianForm').find('.is-invalid').removeClass('is-invalid');
    });

    $('#addLibrarianModal').on('show.bs.modal', function() {
      const today = new Date();
      const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());

      const dateOfBirthInput = document.getElementById('librarianDateOfBirth');
      if (dateOfBirthInput) {
        dateOfBirthInput.max = maxDate.toISOString().split('T')[0];
        dateOfBirthInput.min = minDate.toISOString().split('T')[0];
      }
    });
  },

  loadLibrarians: function() {
    ManageLibrariansView.showLoading();

    ManageLibrariansModel.loadLibrarians(
      function(response) {
        this.librarians = ManageLibrariansModel.processLibrariansResponse(response);
        ManageLibrariansView.displayLibrarians(this.librarians);
      }.bind(this),
      function(error) {
        toastr.error('Failed to load librarians');
        ManageLibrariansView.showError('Failed to load librarians');
      }
    );
  },

  deleteLibrarian: function(librarianId) {
    if (!confirm('Are you sure you want to delete this librarian? This action cannot be undone.')) return;

    if (librarianId == ManageLibrariansModel.currentUserId) {
      toastr.error('You cannot delete your own account');
      return;
    }

    $.blockUI({
      message: '<h4><i class="bi bi-hourglass-split me-2"></i>Deleting librarian...</h4>'
    });

    ManageLibrariansModel.deleteLibrarian(
      librarianId,
      function(response) {
        $.unblockUI();
        if (response && (response.success === true || (response.message && response.message.includes('deleted')))) {
          toastr.success(response.message || 'Librarian deleted successfully');
          this.loadLibrarians();
        } else {
          toastr.success('Librarian deleted successfully');
          this.loadLibrarians();
        }
      }.bind(this),
      function(error) {
        $.unblockUI();
        console.error('Delete error:', error);

        if (error && (error.success === true || (error.message && error.message.includes('deleted')))) {
          toastr.success(error.message || 'Librarian deleted successfully');
          this.loadLibrarians();
        } else {
          let errorMsg = 'Failed to delete librarian';

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
            errorMsg = 'Librarian not found';
          } else if (error.status === 400) {
            errorMsg = 'Cannot delete this librarian';
          }

          toastr.error(errorMsg);
        }
      }.bind(this)
    );
  }
};

window.ManageLibrariansController = ManageLibrariansController;