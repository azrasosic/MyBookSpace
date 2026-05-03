var ManageLibrariansView = {
  init: function() {

  },

  displayLibrarians: function(librarians) {
    var tableBody = document.getElementById('librarians-table-body');

    if (!librarians || librarians.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No librarians found</td></tr>';
      return;
    }

    var html = '';
    librarians.forEach(function(librarian) {
      var dateOfBirth = librarian.date_of_birth ? this.formatDate(librarian.date_of_birth) : 'N/A';
      var employmentDate = librarian.employment_date ? this.formatDate(librarian.employment_date) : 'N/A';

      html += '<tr>' +
        '<td>' + (librarian.name || 'N/A') + '</td>' +
        '<td>' + (librarian.surname || 'N/A') + '</td>' +
        '<td>' + dateOfBirth + '</td>' +
        '<td>' + (librarian.phone || 'N/A') + '</td>' +
        '<td>' + (librarian.email || 'N/A') + '</td>' +
        '<td>' + employmentDate + '</td>' +
        '<td>' +
        '<button class="btn btn-sm btn-danger" onclick="ManageLibrariansController.deleteLibrarian(' + librarian.id + ')">Delete</button>' +
        '</td>' +
        '</tr>';
    }.bind(this));

    tableBody.innerHTML = html;
  },

  getFormData: function(form) {
    var formData = {};
    var inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(function(input) {
      if (input.name && input.name !== 'id') {
        formData[input.name] = input.value;
      }
    });

    return formData;
  },

  formatDate: function(dateString) {
    if (!dateString) return 'N/A';

    try {
      var date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      console.error('ManageLibrariansView: Error formatting date:', dateString, e);
      return dateString;
    }
  },

  showLoading: function() {
    var tableBody = document.getElementById('librarians-table-body');
    if (tableBody) {
      tableBody.innerHTML = '<tr>' +
        '<td colspan="7" class="text-center">' +
        '<div class="spinner-border text-primary" role="status">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '<p class="mt-2">Loading librarians...</p>' +
        '</td>' +
        '</tr>';
    }
  },

  showError: function(message) {
    var tableBody = document.getElementById('librarians-table-body');
    if (tableBody) {
      tableBody.innerHTML = '<tr>' +
        '<td colspan="7" class="text-center text-danger">' +
        '<h5>Error loading librarians</h5>' +
        '<p>' + (message || 'Unknown error') + '</p>' +
        '<button class="btn btn-primary mt-2" onclick="ManageLibrariansController.loadLibrarians()">Retry</button>' +
        '</td>' +
        '</tr>';
    }
  }
};

window.ManageLibrariansView = ManageLibrariansView;