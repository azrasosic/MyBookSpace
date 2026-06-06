var ManageReservationsModel = {
  loadAll: function(successCallback, errorCallback) {
    RestClient.get('reservations', function(data) {
      successCallback(data);
    }, function(xhr) {
      errorCallback(xhr);
    });
  },

  updateStatus: function(reservationId, status, successCallback, errorCallback) {
    RestClient.patch('reservations/' + reservationId + '/status', { status: status }, successCallback, errorCallback);
  },

  cancel: function(reservationId, successCallback, errorCallback) {
    RestClient.delete('reservations/' + reservationId, {}, successCallback, errorCallback);
  }
};

window.ManageReservationsModel = ManageReservationsModel;