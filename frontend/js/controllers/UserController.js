var UserController = {
  init: function() {
    this.setupLoginForms();
    this.setupRegisterForm();

    UserView.updateNavigation();
  },

  setupLoginForms: function() {
    $(document).on('keypress', 'form', function(e) {
      if (e.keyCode === 13 && !$(this).data('allow-enter')) {
        e.preventDefault();
        return false;
      }
    });

    $('#member-login-form').validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 8
        }
      },
      messages: {
        email: {
          required: 'Please enter your email address',
          email: 'Please enter a valid email address'
        },
        password: {
          required: 'Please enter your password',
          minlength: 'Password must be at least 8 characters long'
        }
      },
      errorPlacement: function(error, element) {
        error.addClass('text-danger small mt-1 d-block');
        error.insertAfter(element.closest('.input-group'));
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
          message: '<h4 class="text-white"><i class="bi bi-hourglass-split me-2"></i>Logging in...</h4>'
        });

        const formData = new FormData(form);
        const entity = {
          email: formData.get('email'),
          password: formData.get('password')
        };

        UserController.memberLogin(entity);
        return false;
      }
    });

    $('#librarian-login-form').validate({
      rules: {
        librarian_email: {
          required: true,
          email: true
        },
        librarian_password: {
          required: true,
          minlength: 8
        }
      },
      messages: {
        librarian_email: {
          required: 'Please enter your staff email',
          email: 'Please enter a valid email address'
        },
        librarian_password: {
          required: 'Please enter your password',
          minlength: 'Password must be at least 8 characters long'
        }
      },
      errorPlacement: function(error, element) {
        error.addClass('text-danger small mt-1 d-block');
        error.insertAfter(element.closest('.input-group'));
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
          message: '<h4 class="text-white"><i class="bi bi-hourglass-split me-2"></i>Logging in...</h4>'
        });

        const formData = new FormData(form);
        const entity = {
          email: formData.get('librarian_email'),
          password: formData.get('librarian_password')
        };

        UserController.librarianLogin(entity);
        return false;
      }
    });
  },

  setupRegisterForm: function() {
    $('#registerForm').on('submit', function(e) {
      e.preventDefault();
      return false;
    });

    $('#registerForm').validate({
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
        date_of_birth: {
          required: true
        },
        phone: {
          required: true,
          minlength: 6,
          maxlength: 15
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
        confirm_password: {
          required: true,
          equalTo: 'input[name=\'password\']'
        }
      },
      messages: {
        name: {
          required: 'Please enter your name',
          minlength: 'Name must be at least 2 characters long',
          maxlength: 'Name cannot exceed 50 characters'
        },
        surname: {
          required: 'Please enter your surname',
          minlength: 'Surname must be at least 2 characters long',
          maxlength: 'Surname cannot exceed 50 characters'
        },
        date_of_birth: {
          required: 'Please enter your date of birth'
        },
        phone: {
          required: 'Please enter your phone number',
          minlength: 'Phone number must be at least 6 characters',
          maxlength: 'Phone number cannot exceed 15 characters'
        },
        email: {
          required: 'Please enter your email address',
          email: 'Please enter a valid email address'
        },
        password: {
          required: 'Please enter a password',
          minlength: 'Password must be at least 8 characters long',
          maxlength: 'Password cannot exceed 20 characters'
        },
        confirm_password: {
          required: 'Please confirm your password',
          equalTo: 'Passwords do not match'
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
      invalidHandler: function(form, validator) {
        return false;
      },
      submitHandler: function(form) {
        if (!$(form).valid()) {
          return false;
        }

        $.blockUI({
          message: '<h4 class="text-white"><i class="bi bi-hourglass-split me-2"></i>Registering...</h4>'
        });

        const formData = new FormData(form);
        const entity = Object.fromEntries(formData.entries());

        if (entity.date_of_birth) {
          const dateObj = new Date(entity.date_of_birth);
          entity.date_of_birth = dateObj.toISOString().split('T')[0];
        }

        if (entity.phone) {
          entity.phone = entity.phone.replace(/[^\d+]/g, '');
        }

        UserController.register(entity);
        return false;
      }
    });
  },

  memberLogin: function(entity) {
    UserModel.memberLogin(
      entity,
      function(result) {
        $.unblockUI();
        if (result.data && result.data.token) {
          localStorage.setItem('user_token', result.data.token);
          toastr.success('Login successful as member');

          UserView.updateNavigation();
          UserView.redirectToBooks();
        } else {
          toastr.error('Invalid response from server');
        }
      },
      function(xhr) {
        $.unblockUI();
        let errorMessage = 'Member login failed';

        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            errorMessage = xhr.responseText || errorMessage;
          }
        }

        toastr.error(errorMessage);
      }
    );
  },

  librarianLogin: function(entity) {
    UserModel.librarianLogin(
      entity,
      function(result) {
        $.unblockUI();
        if (result.data && result.data.token) {
          localStorage.setItem('user_token', result.data.token);
          toastr.success('Login successful as librarian');

          UserView.updateNavigation();
          UserView.redirectToBooks();
        } else {
          toastr.error('Invalid response from server');
        }
      },
      function(xhr) {
        $.unblockUI();
        let errorMessage = 'Librarian login failed';

        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            errorMessage = xhr.responseText || errorMessage;
          }
        }

        toastr.error(errorMessage);
      }
    );
  },

  register: function(entity) {
    UserModel.register(
      entity,
      function(result) {
        $.unblockUI();

        toastr.success(result.message || 'Registration successful');

        $('#registerForm')[0].reset();
        $('#registerForm').find('.is-invalid').removeClass('is-invalid');
        $('#registerForm').validate().resetForm();

        if (window.history.replaceState) {
          const cleanUrl = window.location.pathname + window.location.search;
          window.history.replaceState(null, null, cleanUrl);
        }

        setTimeout(function() {
          UserView.redirectToLogin();
        }, 1500);
      },
      function(xhr) {
        $.unblockUI();
        let errorMessage = 'Registration failed. Please try again.';

        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage = xhr.responseJSON.message;
        } else if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        } else if (xhr.responseText) {
          try {
            const errorData = JSON.parse(xhr.responseText);
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            if (xhr.responseText.includes('email') && xhr.responseText.includes('exists')) {
              errorMessage = 'Email already registered. Please use a different email or login.';
            } else if (xhr.responseText.includes('password')) {
              errorMessage = 'Password requirements not met. Password must be at least 8 characters.';
            } else {
              errorMessage = xhr.responseText.substring(0, 100) + '...';
            }
          }
        } else if (xhr.status === 0) {
          errorMessage = 'Network error. Please check your connection.';
        } else if (xhr.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        toastr.error(errorMessage);
      }
    );
  },

  logout: function() {
    $.blockUI({
      message: '<h4 class="text-white"><i class="bi bi-hourglass-split me-2"></i>Logging out...</h4>'
    });

    setTimeout(function() {
      UserModel.logout();
      $.unblockUI();

      toastr.success('Logged out successfully');

      UserView.updateNavigation();

      if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.pathname);
      }

      UserView.redirectToHome();
    }, 500);

    return false;
  },

  isLoggedIn: function() {
    return UserModel.isLoggedIn();
  },

  getCurrentUser: function() {
    return UserModel.getCurrentUser();
  },

  isLibrarian: function() {
    return UserModel.isLibrarian();
  },

  isMember: function() {
    return UserModel.isMember();
  },

  updateGlobalNavigation: function() {
    UserView.updateNavigation();
  }
};

window.UserController = UserController;