var ManageUsersController = {
  allUsers: [],
  currentFilter: 'All',
  isInitialized: false,

  init: function() {
    if (!window.location.hash.includes('#manage-users')) {
      this.isInitialized = false;
      return;
    }
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (!ManageUsersModel.checkAuth()) return;

    this.setupFilterButtons();
    this.setupRenewForm();
    this.loadUsers();
  },

  loadUsers: function() {
    ManageUsersView.showLoading();
    ManageUsersModel.loadUsers(
      function(response) {
        ManageUsersController.allUsers = ManageUsersModel.processResponse(response);
        ManageUsersView.displayUsers(ManageUsersController.allUsers, ManageUsersController.currentFilter);
      },
      function() {
        toastr.error('Failed to load users');
      }
    );
  },

  setupFilterButtons: function() {
    $(document).off('click', '.sub-filter-btn').on('click', '.sub-filter-btn', function() {
      $('.sub-filter-btn').removeClass('active');
      $(this).addClass('active');
      ManageUsersController.currentFilter = $(this).data('filter');
      ManageUsersView.displayUsers(ManageUsersController.allUsers, ManageUsersController.currentFilter);
    });
  },

  openRenewModal: function(userId, userName) {
    ManageUsersView.openRenewModal(userId, userName);
  },

  setupRenewForm: function() {
    $(document).off('submit', '#renewSubscriptionForm').on('submit', '#renewSubscriptionForm', function(e) {
      e.preventDefault();
      var userId = $('#renewUserId').val();
      var expDate = $('#renewExpirationDate').val();

      if (!expDate) {
        toastr.error('Please select a new expiration date');
        return false;
      }

      var today = new Date().toISOString().split('T')[0];
      if (expDate <= today) {
        toastr.error('Expiration date must be in the future');
        return false;
      }

      $.blockUI({ message: '<h4><i class="bi bi-hourglass-split me-2"></i>Renewing subscription...</h4>' });

      ManageUsersModel.renewSubscription(
        userId,
        expDate,
        function(response) {
          $.unblockUI();
          bootstrap.Modal.getInstance(document.getElementById('renewSubscriptionModal')).hide();
          toastr.success('Subscription renewed successfully');
          ManageUsersController.loadUsers();
        },
        function(error) {
          $.unblockUI();
          var msg = 'Failed to renew subscription';
          if (error.responseJSON) msg = error.responseJSON.error || msg;
          toastr.error(msg);
        }
      );

      return false;
    });
  }
};

window.ManageUsersController = ManageUsersController;