/**
 * REST Client
 *
 * Provides HTTP request methods (GET, POST, PUT, PATCH, DELETE) with automatic
 * authentication token injection and unified error handling for API calls.
 */
const RestClient = {
  get(url, callback, errorCallback) {
    $.ajax({
      url: `${Constants.PROJECT_BASE_URL}${url}`,
      type: 'GET',
      beforeSend(xhr) {
        xhr.setRequestHeader('Authentication', localStorage.getItem('user_token'));
      },
      success(response) {
        if (callback) callback(response);
      },
      error(jqXHR, textStatus, errorThrown) {
        if (errorCallback) errorCallback(jqXHR);
      },
    });
  },

  request(url, method, data, callback, errorCallback) {
    $.ajax({
      url: `${Constants.PROJECT_BASE_URL}${url}`,
      type: method,
      beforeSend(xhr) {
        xhr.setRequestHeader('Authentication', localStorage.getItem('user_token'));
      },
      data,
    })
      .done((response, status, jqXHR) => {
        if (callback) callback(response);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        if (errorCallback) {
          errorCallback(jqXHR);
        } else {
          toastr.error(jqXHR.responseJSON?.message || 'Request failed');
        }
      });
  },

  post(url, data, callback, errorCallback) {
    RestClient.request(url, 'POST', data, callback, errorCallback);
  },

  delete(url, data, callback, errorCallback) {
    RestClient.request(url, 'DELETE', data, callback, errorCallback);
  },

  patch(url, data, callback, errorCallback) {
    RestClient.request(url, 'PATCH', data, callback, errorCallback);
  },

  put(url, data, callback, errorCallback) {
    RestClient.request(url, 'PUT', data, callback, errorCallback);
  },
};