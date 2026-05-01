var ManageAuthorsView = {
  init: function() {

  },

  displayAuthors: function(authors) {
    var tableBody = document.getElementById('authors-table-body');
    if (!tableBody) {
      toastr.error('Authors table element not found');
      return;
    }

    if (!authors || authors.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="3" class="text-center">No authors found</td></tr>';
      return;
    }

    var html = '';
    authors.forEach(function(author) {
      var biography = author.biography ?
        (author.biography.length > 100 ? author.biography.substring(0, 100) + '...' : author.biography) :
        'N/A';

      var hasBooks = (author.book_count && author.book_count > 0) || false;
      var deleteDisabled = hasBooks ? 'disabled' : '';
      var deleteTitle = hasBooks ? 'Cannot delete an author with existing books' : 'Delete author';

      html += '<tr>' +
        '<td>' + (author.name || 'N/A') + '</td>' +
        '<td>' + biography + '</td>' +
        '<td>' +
        '<button class="btn btn-sm btn-warning me-1" onclick="ManageAuthorsController.editAuthor(' + author.id + ')">Edit</button>' +
        '<button class="btn btn-sm btn-danger" ' + deleteDisabled + ' onclick="ManageAuthorsController.deleteAuthor(' + author.id + ')" title="' + deleteTitle + '">Delete</button>' +
        '</td>' +
        '</tr>';
    });

    tableBody.innerHTML = html;
  },

  showEditAuthorModal: function(author) {
    document.getElementById('editAuthorId').value = author.id;
    document.getElementById('editAuthorName').value = author.name || '';
    document.getElementById('editAuthorBiography').value = author.biography || '';

    $('#editAuthorModal').modal('show');
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

  showLoading: function() {
    var tableBody = document.getElementById('authors-table-body');
    if (tableBody) {
      tableBody.innerHTML = '<tr>' +
        '<td colspan="3" class="text-center">' +
        '<div class="spinner-border text-primary" role="status">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '<p class="mt-2">Loading authors...</p>' +
        '</td>' +
        '</tr>';
    }
  },

  showError: function(message) {
    var tableBody = document.getElementById('authors-table-body');
    if (tableBody) {
      tableBody.innerHTML = '<tr>' +
        '<td colspan="3" class="text-center text-danger">' +
        '<h5>Error loading authors</h5>' +
        '<p>' + (message || 'Unknown error') + '</p>' +
        '<button class="btn btn-primary mt-2" onclick="ManageAuthorsController.loadAuthors()">Retry</button>' +
        '</td>' +
        '</tr>';
    }
  }
};

window.ManageAuthorsView = ManageAuthorsView;