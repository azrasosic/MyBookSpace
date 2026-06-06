var ManageReservationsView = {
  render: function(reservations) {
    var wrapper = document.getElementById('reservations-table-wrapper');
    if (!wrapper) return;

    if (!reservations || reservations.length === 0) {
      wrapper.innerHTML = '<div class="alert alert-info text-center">No active reservations found.</div>';
      return;
    }

    var statusBadge = function(status) {
      var map = {
        'Pending': 'warning',
        'Available for Pickup': 'success',
        'Collected': 'primary',
        'Cancelled': 'secondary'
      };
      return '<span class="badge bg-' + (map[status] || 'secondary') + '">' + status + '<\/span>';
    };

    var rows = reservations.map(function(r) {
      var date = r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A';
      var canCancel = r.status === 'Pending' || r.status === 'Available for Pickup';
      var canCollect = r.status === 'Available for Pickup';

      return '<tr' + (r.status === 'Available for Pickup' ? ' class="table-success"' : '') + '>' +
        '<td>' + (r.title || 'N/A') + '</td>' +
        '<td>' + (r.user_name || 'N/A') + '</td>' +
        '<td>' + date + '</td>' +
        '<td>' + statusBadge(r.status) + '</td>' +
        '<td>' +
        (canCollect ? '<button class="btn btn-sm btn-primary me-1 mark-collected-btn" data-id="' + r.id + '">Mark Collected</button>' : '') +
        (canCancel ? '<button class="btn btn-sm btn-danger cancel-reservation-btn" data-id="' + r.id + '">Cancel</button>' : '') +
        '</td>' +
        '<\/tr>';
    }).join('');

    wrapper.innerHTML =
      '<table class="table table-hover">' +
      '<thead><tr>' +
      '<th>Book<\/th><th>User<\/th><th>Reservation Date<\/th><th>Status<\/th><th>Actions<\/th>' +
      '<\/tr><\/thead>' +
      '<tbody>' + rows + '<\/tbody>' +
      '<\/table>';
  }
};

window.ManageReservationsView = ManageReservationsView;