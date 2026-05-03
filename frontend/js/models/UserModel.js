var UserModel = {
  memberLogin: function(entity, successCallback, errorCallback) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + 'auth/login',
      type: 'POST',
      data: JSON.stringify(entity),
      contentType: 'application/json',
      dataType: 'json',
      success: successCallback,
      error: errorCallback
    });
  },

  librarianLogin: function(entity, successCallback, errorCallback) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + 'librarians/login',
      type: 'POST',
      data: JSON.stringify(entity),
      contentType: 'application/json',
      dataType: 'json',
      success: successCallback,
      error: errorCallback
    });
  },

  register: function(entity, successCallback, errorCallback) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + 'auth/register',
      type: 'POST',
      data: JSON.stringify(entity),
      contentType: 'application/json',
      dataType: 'json',
      success: successCallback,
      error: errorCallback
    });
  },

  getCurrentUser: function() {
    var token = localStorage.getItem('user_token');
    if (token) {
      try {
        return Utils.parseJwt(token);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isLoggedIn: function() {
    return !!localStorage.getItem('user_token');
  },

  isLibrarian: function() {
    var tokenData = this.getCurrentUser();
    if (!tokenData || !tokenData.user) return false;

    var role = tokenData.user.role;
    return role === 'librarian' || role === 'LIBRARIAN';
  },

  isMember: function() {
    var tokenData = this.getCurrentUser();
    if (!tokenData || !tokenData.user) return false;

    var role = tokenData.user.role;
    return role === 'user' || role === 'USER';
  },

  logout: function() {
    localStorage.removeItem('user_token');
    return true;
  }
};

window.UserModel = UserModel;