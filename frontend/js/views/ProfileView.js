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
    }

    profileTable.innerHTML = html;
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
            '</div>' +
          '</td>' +
        '</tr>';
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
        '<tr>' +
          '<td>' + bookTitle + '</td>' +
          '<td>' + authorName + '</td>' +
          '<td>' + borrowDate + '</td>' +
          '<td>' + returnDate + '</td>' +
          '<td>' + dueDate + '</td>' +
          '<td><span class="badge bg-' + statusClass + '">' + statusText + '</span></td>' +
        '</tr>';
    });

    tableBody.innerHTML = html;
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