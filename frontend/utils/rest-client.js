/**
 * REST Client
 *
 * Provides HTTP request methods (GET, POST, PUT, PATCH, DELETE) with automatic
 * authentication token injection and unified error handling for API calls.
 */
var RestClient = {
  get: function(url, callback, errorCallback) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + url,
      type: 'GET',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authentication', localStorage.getItem('user_token'));
      },
      success: function(response) {
        if (callback) callback(response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        if (errorCallback) errorCallback(jqXHR);
      },
    });
  },

  request: function(url, method, data, callback, errorCallback) {
    $.ajax({
      url: Constants.PROJECT_BASE_URL + url,
      type: method,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authentication', localStorage.getItem('user_token'));
      },
      data: data,
    })
      .done(function(response, status, jqXHR) {
        if (callback) callback(response);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        if (errorCallback) {
          errorCallback(jqXHR);
        } else {
          toastr.error(jqXHR.responseJSON?.message || 'Request failed');
        }
      });
  },

  post: function(url, data, callback, errorCallback) {
    RestClient.request(url, 'POST', data, callback, errorCallback);
  },

  delete: function(url, data, callback, errorCallback) {
    RestClient.request(url, 'DELETE', data, callback, errorCallback);
  },

  patch: function(url, data, callback, errorCallback) {
    RestClient.request(url, 'PATCH', data, callback, errorCallback);
  },

  put: function(url, data, callback, errorCallback) {
    RestClient.request(url, 'PUT', data, callback, errorCallback);
  },
};