var ProfileController = {
  isInitialized: false,
  pendingCancelReservationId: null,

  init: function() {
    if (!window.location.hash.includes('#profile')) return;
    this.isInitialized = false;

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
          this.loadFavourites(userId);
          this.loadReservations(userId);
          var favSec = document.getElementById('my-favourites-section');
          if (favSec) favSec.style.display = '';
          var resSec = document.getElementById('my-reservations-section');
          if (resSec) resSec.style.display = '';
        } else {
          ProfileView.hideBorrowingHistory();
          var favSec = document.getElementById('my-favourites-section');
          if (favSec) favSec.style.display = 'none';
        }
      }.bind(this),
      function(error) {
        var userData = decoded.user;
        window.currentUserData = userData;
        ProfileView.displayUserProfile(userData);
        ProfileView.prefillEditForm(userData);

        if (userRole.toLowerCase() !== 'librarian') {
          this.loadBorrowingHistory();
          this.loadFavourites(userId);
          var favSec = document.getElementById('my-favourites-section');
          if (favSec) favSec.style.display = '';
        } else {
          ProfileView.hideBorrowingHistory();
          var favSec = document.getElementById('my-favourites-section');
          if (favSec) favSec.style.display = 'none';
        }
      }.bind(this)
    );
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

  loadFavourites: function(userId) {
    ProfileModel.loadFavourites(userId,
      function(data) {
        var favSec = document.getElementById('my-favourites-section');
        ProfileView.displayFavourites(Array.isArray(data) ? data : [], userId);
        ProfileController.setupFavouriteActions(userId);
      },
      function(xhr) {
        var c = document.getElementById('my-favourites-list');
        if (c) c.innerHTML = '<p class="text-center text-muted">Could not load favourites.</p>';
      }
    );
  },

  setupFavouriteActions: function(userId) {
    $(document).off('click', '.remove-fav-btn').on('click', '.remove-fav-btn', function() {
      var bookId = $(this).data('book-id');
      ProfileModel.removeFavourite(userId, bookId,
        function() {
          toastr.success('Removed from favourites');
          ProfileController.loadFavourites(userId);
        },
        function() {
          toastr.error('Failed to remove favourite');
        }
      );
    });
  },

  loadReservations: function(userId) {
    ProfileModel.loadReservations(userId,
      function(data) {
        ProfileView.displayReservations(Array.isArray(data) ? data : []);
        ProfileController.setupReservationActions();
      },
      function() {
        var c = document.getElementById('my-reservations-list');
        if (c) c.innerHTML = '<p class="text-center text-muted">Could not load reservations.</p>';
      }
    );
  },

  setupReservationActions: function() {
    var self = this;

    $(document).off('click', '.cancel-user-reservation-btn').on('click', '.cancel-user-reservation-btn', function() {
      self.pendingCancelReservationId = $(this).data('id');
      var modal = new bootstrap.Modal(document.getElementById('cancelReservationModal'));
      modal.show();
    });

    $('#confirmCancelUserReservationBtn').off('click').on('click', function() {
      if (!self.pendingCancelReservationId) return;
      var token = localStorage.getItem('user_token');
      var decoded = Utils.parseJwt(token);
      var userId = decoded.user.id;

      ProfileModel.cancelReservation(self.pendingCancelReservationId,
        function() {
          bootstrap.Modal.getInstance(document.getElementById('cancelReservationModal')).hide();
          toastr.success('Reservation cancelled');
          ProfileController.loadReservations(userId);
        },
        function() {
          toastr.error('Failed to cancel reservation');
        }
      );
    });
  },

  setupEditForm: function() {
    if (!$('#profileEditForm').length) {
      return;
    }

    $('#profileEditForm').validate({
      rules: {
        name:          { required: true, minlength: 2, maxlength: 50 },
        surname:       { required: true, minlength: 2, maxlength: 50 },
        date_of_birth: { required: true },
        phone:         { required: true, minlength: 6, maxlength: 15 },
        email:         { required: true, email: true }
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
        date_of_birth: { required: 'Please enter your date of birth' },
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
      highlight:   function(el) { $(el).addClass('is-invalid').removeClass('is-valid'); },
      unhighlight: function(el) { $(el).removeClass('is-invalid'); },
      submitHandler: function(form) {
        if (ProfileView.isSubmitting) return false;
        $.blockUI({ message: '<h4><i class="bi bi-hourglass-split me-2"></i>Saving changes...</h4>' });
        ProfileView.isSubmitting = true;

        var token   = localStorage.getItem('user_token');
        var decoded = Utils.parseJwt(token);
        if (!decoded || !decoded.user) {
          toastr.error('User not authenticated');
          ProfileView.isSubmitting = false;
          $.unblockUI();
          return false;
        }

        var userId   = decoded.user.id;
        var userRole = decoded.user.role || '';
        var formData = {
          name:          document.getElementById('editName').value || '',
          surname:       document.getElementById('editSurname').value || '',
          date_of_birth: document.getElementById('editDateOfBirth').value || '',
          phone:         document.getElementById('editPhone').value.replace(/[^\d+]/g, '') || '',
          email:         document.getElementById('editEmail').value || ''
        };

        ProfileModel.updateProfile(userId, userRole, formData,
          function(response) {
            $.unblockUI();
            ProfileView.isSubmitting = false;
            if (response.success) {
              toastr.success('Profile updated successfully.');
              ProfileView.updateDisplayedProfile(formData);
              $('#editProfileModal').modal('hide');
              $('#profileEditForm').find('.is-invalid').removeClass('is-invalid');
              if (response.data && response.data.token) {
                localStorage.setItem('user_token', response.data.token);
              }
              setTimeout(function() { window.location.reload(); }, 1500);
            } else {
              toastr.error(response.error || 'Failed to update profile');
            }
          },
          function(error) {
            $.unblockUI();
            ProfileView.isSubmitting = false;
            var msg = 'Failed to update profile';
            if (error.responseJSON) msg = error.responseJSON.error || error.responseJSON.message || msg;
            toastr.error(msg);
          }
        );
        return false;
      }
    });

    $('#editProfileModal').on('show.bs.modal', function() {
      if (window.currentUserData) ProfileView.prefillEditForm(window.currentUserData);
    });
    $('#editProfileModal').on('hidden.bs.modal', function() {
      $('#profileEditForm').validate().resetForm();
      $('#profileEditForm').find('.is-invalid').removeClass('is-invalid');
    });
  },

  setupChangePasswordForm: function() {
    if (!$('#changePasswordForm').length) return;

    $.validator.addMethod('notEqualToCurrent', function(value) {
      return value !== $('#currentPassword').val();
    }, 'New password cannot be the same as current password');

    $('#changePasswordForm').validate({
      rules: {
        currentPassword:    { required: true, minlength: 8 },
        newPassword:        { required: true, minlength: 8, maxlength: 20, notEqualToCurrent: true },
        confirmNewPassword: { required: true, equalTo: '#newPassword' }
      },
      messages: {
        currentPassword:    { required: 'Please enter your current password', minlength: 'At least 8 characters' },
        newPassword:        { required: 'Please enter a new password', minlength: 'At least 8 characters', maxlength: 'Max 20 characters' },
        confirmNewPassword: { required: 'Please confirm your new password', equalTo: 'Passwords do not match' }
      },
      errorPlacement: function(error, element) {
        error.addClass('text-danger small mt-1 d-block');
        error.insertAfter(element);
      },
      highlight:   function(el) { $(el).addClass('is-invalid'); },
      unhighlight: function(el) { $(el).removeClass('is-invalid'); },
      submitHandler: function() {
        $.blockUI({ message: '<h4><i class="bi bi-hourglass-split me-2"></i>Changing password...</h4>' });

        var token   = localStorage.getItem('user_token');
        var decoded = Utils.parseJwt(token);
        if (!decoded || !decoded.user || !decoded.user.id) {
          $.unblockUI();
          toastr.error('User not found. Please login again.');
          return false;
        }

        var userId   = decoded.user.id;
        var userRole = decoded.user.role || '';

        ProfileModel.changePassword(userId, userRole,
          { currentPassword: document.getElementById('currentPassword').value,
            newPassword:     document.getElementById('newPassword').value },
          function(response) {
            $.unblockUI();
            if (response.success) {
              toastr.success(response.message || 'Password changed successfully.');
              $('#changePasswordForm')[0].reset();
              $('#changePasswordModal').modal('hide');
              if (response.data && response.data.token) {
                localStorage.setItem('user_token', response.data.token);
              }
              setTimeout(function() { window.location.reload(); }, 1500);
            } else {
              toastr.error(response.error || 'Failed to change password');
            }
          },
          function(error) {
            $.unblockUI();
            var msg = 'Failed to change password';
            if (error.responseJSON) msg = error.responseJSON.error || error.responseJSON.message || msg;
            else if (error.status === 401) msg = 'Current password is incorrect';
            toastr.error(msg);
          }
        );
        return false;
      }
    });

    $('#changePasswordModal').on('hidden.bs.modal', function() {
      $('#changePasswordForm').validate().resetForm();
      $('#changePasswordForm').find('.is-invalid, .is-valid').removeClass('is-invalid is-valid');
    });
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