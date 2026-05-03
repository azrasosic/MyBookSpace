var ProfileController = {
  isInitialized: false,

  init: function() {
    if (!window.location.hash.includes('#profile')) {
      this.isInitialized = false;
      return;
    }

    if (this.isInitialized) {
      return;
    }

    this.isInitialized = true;

    if (typeof ProfileView !== 'undefined') {
      ProfileView.resetModalState();
    }

    this.loadUserProfile();

    this.setupEditForm();
    this.setupChangePasswordForm();

    setTimeout(function() {
      if (window.history.replaceState) {
        var cleanUrl = window.location.pathname + window.location.search + '#profile';
        window.history.replaceState(null, null, cleanUrl);
      }
    }, 0);
  },

  loadUserProfile: function() {
    var token = localStorage.getItem('user_token');
    if (!token) {
      toastr.error('Please log in to view profile');
      window.location.href = '#login';
      return;
    }

    var decoded;
    try {
      decoded = Utils.parseJwt(token);
    } catch (e) {
      toastr.error('Invalid session');
      window.location.href = '#login';
      return;
    }

    if (!decoded || !decoded.user) {
      toastr.error('Invalid user data');
      return;
    }

    var userId = decoded.user.id;
    var userRole = decoded.user.role || '';

    if (ProfileView.showLoading) ProfileView.showLoading();

    ProfileModel.loadCurrentUserProfile(
      function(response) {
        var userData;

        if (response && typeof response === 'object') {
          userData = response;

          if (!userData.role && userRole) {
            userData.role = userRole;
          }
        } else {
          userData = decoded.user;
        }

        window.currentUserData = userData;

        ProfileView.displayUserProfile(userData);
        ProfileView.prefillEditForm(userData);

        if (userData.role && userData.role.toLowerCase() !== 'librarian') {
          this.loadBorrowingHistory();
        } else {
          ProfileView.hideBorrowingHistory();
        }
      }.bind(this),
      function(error) {
        console.error('Failed to load profile:', error);
        toastr.warning('Could not fetch updated profile data, using cached data');

        var userData = decoded.user;
        window.currentUserData = userData;
        ProfileView.displayUserProfile(userData);
        ProfileView.prefillEditForm(userData);

        var userRole = decoded.user.role || '';
        if (userRole.toLowerCase() !== 'librarian') {
          this.loadBorrowingHistory();
        } else {
          ProfileView.hideBorrowingHistory();
        }
      }.bind(this)
    );
  },

  setupEditForm: function() {
    if (!$('#profileEditForm').length) {
      console.error('Edit profile form not found');
      return;
    }

    $('#profileEditForm').validate({
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
        if (ProfileView.isSubmitting) return false;

        $.blockUI({
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Saving changes...</h4>'
        });

        ProfileView.isSubmitting = true;

        var token = localStorage.getItem('user_token');
        var decoded = Utils.parseJwt(token);

        if (!decoded || !decoded.user) {
          toastr.error('User not authenticated');
          ProfileView.isSubmitting = false;
          $.unblockUI();
          return false;
        }

        var userId = decoded.user.id;
        var userRole = decoded.user.role || '';

        var formData = {
          name: document.getElementById('editName').value || '',
          surname: document.getElementById('editSurname').value || '',
          date_of_birth: document.getElementById('editDateOfBirth').value || '',
          phone: document.getElementById('editPhone').value || '',
          email: document.getElementById('editEmail').value || ''
        };

        if (formData.phone) {
          formData.phone = formData.phone.replace(/[^\d+]/g, '');
        }

        ProfileModel.updateProfile(userId, userRole, formData,
          function(response) {
            $.unblockUI();
            ProfileView.isSubmitting = false;

            if (response.success) {
              toastr.success('Profile updated successfully.');

              ProfileView.updateDisplayedProfile(formData);

              $('#editProfileModal').modal('hide');

              $('#profileEditForm').find('.is-invalid').removeClass('is-invalid');

              if (window.history.replaceState) {
                var cleanUrl = window.location.pathname + window.location.search + '#profile';
                window.history.replaceState(null, null, cleanUrl);
              }

              if (response.data && response.data.token) {
                localStorage.setItem('user_token', response.data.token);
              }

              setTimeout(function() {
                window.location.reload();
              }, 1500);
            } else {
              toastr.error(response.error || 'Failed to update profile');
            }
          },
          function(error) {
            $.unblockUI();
            ProfileView.isSubmitting = false;

            var errorMessage = 'Failed to update profile';
            if (error.responseJSON) {
              errorMessage = error.responseJSON.error || error.responseJSON.message || errorMessage;
            } else if (error.responseText) {
              try {
                var errorData = JSON.parse(error.responseText);
                errorMessage = errorData.error || errorData.message || errorMessage;
              } catch (e) {
                if (error.responseText.trim()) {
                  errorMessage = error.responseText;
                }
              }
            }

            toastr.error(errorMessage);
          }
        );

        return false;
      }
    });

    $('#editProfileModal').on('show.bs.modal', function() {
      if (window.currentUserData) {
        ProfileView.prefillEditForm(window.currentUserData);
      }
    });

    $('#editProfileModal').on('hidden.bs.modal', function() {
      $('#profileEditForm').validate().resetForm();
      $('#profileEditForm').find('.is-invalid').removeClass('is-invalid');
    });
  },

  setupChangePasswordForm: function() {
    if (!$('#changePasswordForm').length) {
      console.error('Change password form not found');
      return;
    }

    $('#changePasswordForm').validate({
      rules: {
        currentPassword: {
          required: true,
          minlength: 8
        },
        newPassword: {
          required: true,
          minlength: 8,
          maxlength: 20,
          notEqualToCurrent: true
        },
        confirmNewPassword: {
          required: true,
          equalTo: '#newPassword'
        }
      },
      messages: {
        currentPassword: {
          required: 'Please enter your current password',
          minlength: 'Current password must be at least 8 characters'
        },
        newPassword: {
          required: 'Please enter a new password',
          minlength: 'New password must be at least 8 characters long',
          maxlength: 'New password cannot exceed 20 characters',
          notEqualToCurrent: 'New password cannot be the same as current password'
        },
        confirmNewPassword: {
          required: 'Please confirm your new password',
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
      submitHandler: function(form) {
        $.blockUI({
          message: '<h4><i class="bi bi-hourglass-split me-2"></i>Changing password...</h4>'
        });

        var currentPassword = document.getElementById('currentPassword').value;
        var newPassword = document.getElementById('newPassword').value;
        var confirmNewPassword = document.getElementById('confirmNewPassword').value;

        var token = localStorage.getItem('user_token');
        var decoded = Utils.parseJwt(token);

        if (!decoded || !decoded.user || !decoded.user.id) {
          $.unblockUI();
          toastr.error('User not found. Please login again.');
          return false;
        }

        var userId = decoded.user.id;
        var userRole = decoded.user.role || '';

        var formData = {
          currentPassword: currentPassword,
          newPassword: newPassword
        };

        ProfileModel.changePassword(userId, userRole, formData,
          function(response) {
            $.unblockUI();

            if (response.success) {
              toastr.success(response.message || 'Password changed successfully.');

              $('#changePasswordForm')[0].reset();
              $('#changePasswordForm').find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
              $('#changePasswordForm').validate().resetForm();

              $('#changePasswordModal').modal('hide');

              if (response.data && response.data.token) {
                localStorage.setItem('user_token', response.data.token);
              }

              setTimeout(function() {
                window.location.reload();
              }, 1500);
            } else {
              toastr.error(response.error || 'Failed to change password');
            }
          },
          function(error) {
            $.unblockUI();

            var errorMessage = 'Failed to change password';
            if (error.responseJSON) {
              errorMessage = error.responseJSON.error || error.responseJSON.message || errorMessage;
            } else if (error.responseText) {
              try {
                var errorData = JSON.parse(error.responseText);
                errorMessage = errorData.error || errorData.message || errorMessage;
              } catch (e) {
                if (error.responseText.trim()) {
                  errorMessage = error.responseText;
                }
              }
            } else if (error.status === 401) {
              errorMessage = 'Current password is incorrect';
            } else if (error.status === 404) {
              errorMessage = 'User not found';
            }

            toastr.error(errorMessage);
          }
        );

        return false;
      }
    });

    $.validator.addMethod('notEqualToCurrent', function(value, element) {
      var currentPassword = $('#currentPassword').val();
      return value !== currentPassword;
    }, 'New password cannot be the same as current password');

    $('#newPassword, #confirmNewPassword').on('keyup', function() {
      var newPassword = $('#newPassword').val();
      var confirmPassword = $('#confirmNewPassword').val();

      if (confirmPassword && newPassword !== confirmPassword) {
        $('#confirmNewPassword').addClass('is-invalid').removeClass('is-valid');
      } else if (confirmPassword) {
        $('#confirmNewPassword').removeClass('is-invalid').addClass('is-valid');
      }
    });

    $('#changePasswordModal').on('hidden.bs.modal', function() {
      $('#changePasswordForm').validate().resetForm();
      $('#changePasswordForm').find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
    });
  },

  loadBorrowingHistory: function() {
    var token = localStorage.getItem('user_token');
    var decoded = Utils.parseJwt(token);

    if (!decoded || !decoded.user.id) {
      ProfileView.displayBorrowingHistory([]);
      return;
    }

    var userId = decoded.user.id;

    ProfileModel.loadBorrowingHistory(userId,
      function(response) {
        this.processBorrowingHistory(response);
      }.bind(this),
      function(error) {
        ProfileView.displayBorrowingHistory([]);
      }
    );
  },

  processBorrowingHistory: function(response) {
    if (!Array.isArray(response) || response.length === 0) {
      ProfileView.displayBorrowingHistory([]);
      return;
    }

    this.processRecordsWithAuthors(response, 0, []);
  },

  processRecordsWithAuthors: function(records, index, processedRecords) {
    if (index >= records.length) {
      ProfileView.displayBorrowingHistory(processedRecords);
      return;
    }

    var record = records[index];
    var recordWithAuthor = Object.assign({}, record);

    if (record.author_id) {
      ProfileModel.fetchAuthorName(record.author_id,
        function(authorName) {
          recordWithAuthor.author_name = authorName;
          processedRecords.push(recordWithAuthor);
          this.processRecordsWithAuthors(records, index + 1, processedRecords);
        }.bind(this),
        function() {
          recordWithAuthor.author_name = 'Unknown Author';
          processedRecords.push(recordWithAuthor);
          this.processRecordsWithAuthors(records, index + 1, processedRecords);
        }.bind(this)
      );
    } else {
      recordWithAuthor.author_name = 'Unknown Author';
      processedRecords.push(recordWithAuthor);
      this.processRecordsWithAuthors(records, index + 1, processedRecords);
    }
  }
};

window.ProfileController = ProfileController;