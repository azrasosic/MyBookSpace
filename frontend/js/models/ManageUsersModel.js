var ManageUsersModel = {
  currentUserId: null,

  checkAuth: function() {
    try {
      var token = localStorage.getItem('user_token');
      if (!token) {
        window.location.href = '#login';
        return false;
      }
      var decoded = Utils.parseJwt(token);
      if (!decoded || !decoded.user) {
        window.location.href = '#login';
        return false;
      }
      this.currentUserId = decoded.user.id;
      if ((decoded.user.role || '').toLowerCase() !== 'librarian') {
        toastr.error('Access denied. Librarian role required.');
        window.location.href = '#profile';
        return false;
      }
      return true;
    } catch (e) {
      window.location.href = '#login';
      return false;
    }
  },

  loadUsers: function(successCallback, errorCallback) {
    RestClient.get('users', successCallback, errorCallback);
  },

  renewSubscription: function(userId, expirationDate, successCallback, errorCallback) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + 'users/' + userId + '/subscription/renew',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ expiration_date: expirationDate }),
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authentication', localStorage.getItem('user_token'));
      },
      success: successCallback,
      error: errorCallback
    });
  },

  processResponse: function(response) {
    if (Array.isArray(response)) return response;
    if (response && response.data) return Array.isArray(response.data) ? response.data : [response.data];
    return [];
  }
};

window.ManageUsersModel = ManageUsersModel;