var ManageUsersView = {
  showLoading: function() {
    $('#users-table-body').html(
      '<tr><td colspan="5" class="text-center py-4">' +
      '<div class="spinner-border text-primary" role="status"><\/div>' +
      '<p class="mt-2 mb-0">Loading users...</p>' +
      '<\/td><\/tr>'
    );
  },

  displayUsers: function(users, filter) {
    var tbody = $('#users-table-body');
    tbody.empty();

    var filtered = users;
    if (filter && filter !== 'All') {
      filtered = users.filter(function(u) {
        return u.subscription_status === filter;
      });
    }

    if (!filtered || filtered.length === 0) {
      tbody.html('<tr><td colspan="5" class="text-center py-4 text-muted">No users found<\/td><\/tr>');
      return;
    }

    filtered.forEach(function(u) {
      var statusBadge = ManageUsersView.subscriptionBadge(u.subscription_status);
      var expDate = u.subscription_expiration_date
        ? new Date(u.subscription_expiration_date).toLocaleDateString()
        : '<em class="text-muted">Not set<\/em>';

      tbody.append(
        '<tr>' +
        '<td>' + (u.name || '') + ' ' + (u.surname || '') + '</td>' +
        '<td>' + (u.email || '') + '</td>' +
        '<td>' + statusBadge + '</td>' +
        '<td>' + expDate + '</td>' +
        '<td>' +
        '<button class="btn btn-sm btn-primary" ' +
        'onclick="ManageUsersController.openRenewModal(' + u.id + ', \'' +
        (u.name + ' ' + u.surname).replace(/'/g, "\\'") + '\')">' +
        '<i class="bi bi-arrow-repeat me-1"><\/i>Renew Subscription' +
        '<\/button>' +
        '<\/td>' +
        '<\/tr>'
      );
    });
  },

  subscriptionBadge: function(status) {
    var map = { 'Active': 'success', 'Expiring Soon': 'warning', 'Expired': 'danger' };
    var cls = map[status] || 'secondary';
    return '<span class="badge bg-' + cls + '">' + (status || 'Unknown') + '<\/span>';
  },

  openRenewModal: function(userId, userName) {
    $('#renewUserId').val(userId);
    $('#renewUserName').text(userName);
    $('#renewExpirationDate').val('');
    var modal = new bootstrap.Modal(document.getElementById('renewSubscriptionModal'));
    modal.show();
  }
};

window.ManageUsersView = ManageUsersView;