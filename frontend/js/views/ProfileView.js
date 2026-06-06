var ProfileView = {
  isSubmitting: false,

  init: function() {

  },

  resetModalState: function() {
    var backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(function(backdrop) {
      backdrop.parentNode.removeChild(backdrop);
    });

    document.body.classList.remove('modal-open');

    document.body.style = '';

    var modalFades = document.querySelectorAll('.modal.fade.show');
    modalFades.forEach(function(modal) {
      modal.style.display = 'none';
    });

    var allModals = document.querySelectorAll('.modal');
    allModals.forEach(function(modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    });

    document.body.style.paddingRight = '';
    document.body.style.overflow = '';
  },

  displayUserProfile: function(user) {
    var profileTable = document.querySelector('#profile table tbody');
    if (!profileTable) {
      profileTable = document.querySelector('.profile table tbody');
    }

    if (!profileTable) {
      return;
    }

    var formatDate = function(dateStr) {
      if (!dateStr) return 'N/A';
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        return dateStr;
      }
    };

    var html = '' +
      '<tr>' +
        '<th scope="row" width="30%">Name</th>' +
        '<td>' + (user.name || 'N/A') + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Surname</th>' +
        '<td>' + (user.surname || 'N/A') + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Date of Birth</th>' +
        '<td>' + formatDate(user.date_of_birth) + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Phone number</th>' +
        '<td>' + (user.phone || 'N/A') + '</td>' +
      '</tr>' +
      '<tr>' +
        '<th scope="row">Email</th>' +
        '<td>' + (user.email || 'N/A') + '</td>' +
      '</tr>';

    if (user.role === 'librarian') {
      html += '<tr>' +
        '<th scope="row">Employment Date</th>' +
        '<td>' + formatDate(user.employment_date) + '</td>' +
      '</tr>';
    } else {
      html += '<tr>' +
        '<th scope="row">Member Since</th>' +
        '<td>' + formatDate(user.date_joined) + '</td>' +
      '</tr>';

      var subStatus = user.subscription_status || 'Expired';
      var subExp = user.subscription_expiration_date ? formatDate(user.subscription_expiration_date) : 'N/A';
      var badgeMap = { 'Active': 'success', 'Expiring Soon': 'warning', 'Expired': 'danger' };
      var badge = '<span class="badge bg-' + (badgeMap[subStatus] || 'secondary') + '">' + subStatus + '<\/span>';
      html += '<tr><th>Subscription</th><td>' + badge + ' (expires: ' + subExp + ')<\/td><\/tr>';
    }

    profileTable.innerHTML = html;
    this.displaySubscriptionBanner(user);
  },

  displaySubscriptionBanner: function(user) {
    var banner = document.getElementById('subscription-banner');
    if (!banner || user.role === 'librarian') return;

    var status = user.subscription_status || 'Expired';
    var expDate = user.subscription_expiration_date;
    var fmt = function(d) {
      try {
        return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch(e) {
        return d;
      }
    };

    if (status === 'Expiring Soon') {
      banner.innerHTML = '<div class="alert alert-warning mt-3"><i class="bi bi-exclamation-triangle-fill me-2"><\/i>Your subscription is expiring on ' + fmt(expDate) + '. Please visit the library to renew.<\/div>';
      banner.style.display = '';
    } else if (status === 'Expired') {
      banner.innerHTML = '<div class="alert alert-danger mt-3"><i class="bi bi-x-circle-fill me-2"><\/i>Your subscription has expired. Please visit the library to renew your membership before borrowing books.<\/div>';
      banner.style.display = '';
    } else {
      banner.style.display = 'none';
    }
  },

  displayUsersSubscriptions: function(users, filter) {
    var wrapper = document.getElementById('users-subscription-table-wrapper');
    if (!wrapper) return;

    var filtered = filter && filter !== 'All'
      ? users.filter(function(u) {
          return u.subscription_status === filter;
        })
      : users;

    if (filtered.length === 0) {
      wrapper.innerHTML = '<div class="alert alert-info text-center">No users found for this filter.<\/div>';
      return;
    }

    var fmt = function(d) {
      if (!d) return 'N/A';
      try {
        return new Date(d).toLocaleDateString();
      } catch(e) {
        return d;
      }
    };
    var badgeMap = { 'Active': 'success', 'Expiring Soon': 'warning', 'Expired': 'danger' };
    var rows = filtered.map(function(u) {
      return '<tr>' +
        '<td>' + (u.name || '') + ' ' + (u.surname || '') + '</td>' +
        '<td>' + (u.email || '') + '</td>' +
        '<td><span class="badge bg-' + (badgeMap[u.subscription_status] || 'secondary') + '">' + (u.subscription_status || 'Unknown') + '<\/span></td>' +
        '<td>' + fmt(u.subscription_expiration_date) + '</td>' +
        '<td><button class="btn btn-sm btn-success renew-sub-btn" data-id="' + u.id + '" data-name="' + (u.name + ' ' + u.surname) + '">Renew<\/button></td>' +
        '<\/tr>';
    }).join('');

    wrapper.innerHTML = '<table class="table table-hover"><thead><tr><th>Name<\/th><th>Email<\/th><th>Status<\/th><th>Expires<\/th><th>Action<\/th><\/tr><\/thead><tbody>' + rows + '<\/tbody><\/table>';
  },

  prefillEditForm: function(user) {
    var fields = {
      'editName': user.name || '',
      'editSurname': user.surname || '',
      'editDateOfBirth': user.date_of_birth || '',
      'editPhone': user.phone || '',
      'editEmail': user.email || ''
    };

    Object.entries(fields).forEach(function(entry) {
      var id = entry[0];
      var value = entry[1];
      var field = document.getElementById(id);
      if (field) {
        field.value = value;
      }
    });
  },

  hideBorrowingHistory: function() {
    var borrowingSection = document.getElementById('bookings');
    if (borrowingSection) {
      borrowingSection.style.display = 'none';
    }
  },

  displayBorrowingHistory: function(records) {
    var tableBody = document.querySelector('#borrowing-history');
    if (!tableBody) {
      return;
    }

    if (!Array.isArray(records) || records.length === 0) {
      tableBody.innerHTML = '' +
        '<tr>' +
          '<td colspan="6" class="text-center">' +
            '<div class="alert alert-info">' +
              'No borrowing history found.' +
            '<\/div>' +
          '<\/td>' +
        '<\/tr>';
      return;
    }

    var html = '';

    records.forEach(function(record) {
      var bookTitle = record.title || 'Unknown Book';
      var authorName = record.author_name || 'Unknown Author';

      var formatDate = function(dateStr) {
        if (!dateStr) return 'N/A';
        try {
          return new Date(dateStr).toLocaleDateString();
        } catch (e) {
          return dateStr;
        }
      };

      var borrowDate = formatDate(record.borrow_date);
      var returnDate = formatDate(record.return_date);
      var dueDate = formatDate(record.due_date);
      var status = record.borrowing_status || 'Unknown';

      var statusClass = 'secondary';
      var statusText = status;

      var statusLower = status.toLowerCase();

      if ((statusLower.includes('active') || statusLower.includes('borrowed')) && record.due_date) {
        var today = new Date();
        var due = new Date(record.due_date);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        if (due < today) {
          statusClass = 'danger';
          statusText = 'Overdue';
        } else {
          statusClass = 'warning';
          statusText = 'Active';
        }
      } else if (statusLower.includes('returned')) {
        statusClass = 'success';
        statusText = 'Returned';
      } else if (statusLower.includes('overdue')) {
        statusClass = 'danger';
        statusText = 'Overdue';
      }

      html += '' +
        '</tr>' +
          '<td>' + bookTitle + '</td>' +
          '<td>' + authorName + '</td>' +
          '<td>' + borrowDate + '</td>' +
          '<td>' + returnDate + '</td>' +
          '<td>' + dueDate + '</td>' +
          '<td><span class="badge bg-' + statusClass + '">' + statusText + '<\/span></td>' +
        '<\/tr>';
    });

    tableBody.innerHTML = html;
  },

  displayFavourites: function(favourites, userId) {
    var container = document.getElementById('my-favourites-list');
    if (!container) return;
    if (!favourites || favourites.length === 0) {
      container.innerHTML = '<p class="text-center text-muted">You have no favourite books yet.<\/p>';
      return;
    }
    var html = '<div class="table-responsive"><table class="table table-hover"><thead><tr><th>Title<\/th><th>Author<\/th><th>Genre<\/th><th>Actions<\/th><\/tr><\/thead><tbody>';
    favourites.forEach(function(f) {
      html += '<tr>' +
        '<td><a href="#book-details" class="book-details-link text-decoration-none" data-book-id="' + f.book_id + '" onclick="localStorage.setItem(\'currentBookId\',\'' + f.book_id + '\')">' + (f.title || 'N/A') + '<\/a></td>' +
        '<td>' + (f.author_name || 'N/A') + '</td>' +
        '<td>' + (f.genre || 'N/A') + '</td>' +
        '<td><button class="btn btn-sm btn-outline-danger remove-fav-btn" data-book-id="' + f.book_id + '" data-user-id="' + userId + '">Remove<\/button></td>' +
        '<\/tr>';
    });
    html += '<\/tbody><\/table><\/div>';
    container.innerHTML = html;
  },

  displayReservations: function(reservations) {
    var container = document.getElementById('my-reservations-list');
    if (!container) return;
    if (!reservations || reservations.length === 0) {
      container.innerHTML = '<p class="text-center text-muted">You have no active reservations.<\/p>';
      return;
    }
    var fmt = function(d) {
      try {
        return new Date(d).toLocaleDateString();
      } catch(e) {
        return d || 'N/A';
      }
    };
    var html = '<table class="table table-hover"><thead><tr><th>Book<\/th><th>Author<\/th><th>Reserved<\/th><th>Status<\/th><th>Action<\/th><\/tr><\/thead><tbody>';
    reservations.forEach(function(r) {
      var isAvail = r.status === 'Available for Pickup';
      html += '<tr' + (isAvail ? ' class="table-success"' : '') + '>' +
        '<td>' + (r.title || 'N/A') + '</td>' +
        '<td>' + (r.author_name || 'N/A') + '</td>' +
        '<td>' + fmt(r.created_at) + '</td>' +
        '<td><span class="badge bg-' + (isAvail ? 'success' : 'warning') + '">' + r.status + '<\/span></td>' +
        '<td><button class="btn btn-sm btn-danger cancel-user-reservation-btn" data-id="' + r.id + '">Cancel<\/button></td>' +
        '<\/tr>';
    });
    html += '<\/tbody><\/table>';
    container.innerHTML = html;
  },

  updateDisplayedProfile: function(formData) {
    var updateTableRow = function(rowIndex, value) {
      var row = document.querySelector('#profile table tbody tr:nth-child(' + rowIndex + ') td');
      if (row) {
        row.textContent = value || 'N/A';
      }
    };

    if (formData.name !== undefined) updateTableRow(1, formData.name);
    if (formData.surname !== undefined) updateTableRow(2, formData.surname);

    if (formData.date_of_birth) {
      var formattedDate = new Date(formData.date_of_birth).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      updateTableRow(3, formattedDate);
    }

    if (formData.phone !== undefined) updateTableRow(4, formData.phone);
    if (formData.email !== undefined) updateTableRow(5, formData.email);
  }
};

window.ProfileView = ProfileView;