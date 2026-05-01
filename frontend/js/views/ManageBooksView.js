var ManageBooksView = {
  init: function() {

  },

  displayBooks: function(books, authors) {
    var tableBody = document.getElementById('books-table-body');

    if (!books || books.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No books found</td></tr>';
      return;
    }

    var html = '';
    books.forEach(function(book) {
      var authorName = ManageBooksModel.getAuthorName(book, authors);
      var isbn = book.ISBN || book.isbn || 'N/A';
      var summary = book.summary ?
        (book.summary.length > 50 ? book.summary.substring(0, 50) + '...' : book.summary) :
        'N/A';
      var imageUrl = book.image_url || book.Image_url || 'N/A';

      var isBorrowed = book.status && book.status.toLowerCase() === 'borrowed';
      var deleteButtonDisabled = isBorrowed ? 'disabled' : '';
      var deleteButtonTitle = isBorrowed ? 'Cannot delete borrowed book' : 'Delete book';

      html += '<tr>' +
        '<td>' + (book.title || 'N/A') + '</td>' +
        '<td>' + authorName + '</td>' +
        '<td>' + isbn + '</td>' +
        '<td>' + (book.publication_year || 'N/A') + '</td>' +
        '<td>' + (book.genre || 'N/A') + '</td>' +
        '<td>' + summary + '</td>' +
        '<td><span class="badge ' + this.getStatusClass(book.status) + '">' + (book.status || 'Unknown') + '</span></td>' +
        '<td>' +
        '<button class="btn btn-sm btn-warning me-1" onclick="ManageBooksController.editBook(' + book.id + ')">Edit</button>' +
        '<button class="btn btn-sm btn-danger" ' + deleteButtonDisabled + ' onclick="ManageBooksController.deleteBook(' + book.id + ')" title="' + deleteButtonTitle + '">Delete</button>' +
        '</td>' +
        '</tr>';
    }.bind(this));
    tableBody.innerHTML = html;
  },

  populateAuthorsDropdown: function(dropdownId, authors, selectedId) {
    var dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;

    dropdown.innerHTML = '';
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select Author';
    dropdown.appendChild(defaultOption);

    if (authors && authors.length > 0) {
      var selectedIdStr = selectedId !== null && selectedId !== undefined ? selectedId.toString() : '';

      authors.forEach(function(author) {
        var option = document.createElement('option');
        option.value = author.id;
        option.textContent = author.name || 'Unknown';

        if (author.id !== null && author.id !== undefined && author.id.toString() === selectedIdStr) {
          option.selected = true;
        }

        dropdown.appendChild(option);
      });
    } else {
      var noAuthorsOption = document.createElement('option');
      noAuthorsOption.value = '';
      noAuthorsOption.textContent = 'No authors available';
      dropdown.appendChild(noAuthorsOption);
    }

    if (selectedId !== null && selectedId !== undefined) {
      setTimeout(function() {
        dropdown.value = selectedId;
      }, 50);
    }
  },

  showAddBookModal: function(authors) {
    this.populateAuthorsDropdown('bookAuthor', authors, null);
    $('#addBookModal').modal('show');
  },

  showEditBookModal: function(book, authors) {
    document.getElementById('editBookId').value = book.id;
    document.getElementById('editBookTitle').value = book.title || '';
    document.getElementById('editBookISBN').value = book.ISBN || book.isbn || '';
    document.getElementById('editBookYear').value = book.publication_year || '';
    document.getElementById('editBookGenre').value = book.genre || '';
    document.getElementById('editBookSummary').value = book.summary || '';
    document.getElementById('editBookImageUrl').value = book.image_url || '';
    document.getElementById('editBookStatus').value = book.status || 'Available';

    var authorId = null;
    if (book.author_id) {
      authorId = book.author_id;
    } else if (book.author_name && authors.length > 0) {
      var foundAuthor = authors.find(function(a) {
        return a.name && a.name.toLowerCase() === book.author_name.toLowerCase();
      });
      if (foundAuthor) {
        authorId = foundAuthor.id;
      }
    }

    this.populateAuthorsDropdown('editBookAuthor', authors, authorId);
    $('#editBookModal').modal('show');
  },

  closeAddBookModal: function() {
    $('#addBookModal').modal('hide');
    var form = document.getElementById('addBookForm');
    if (form) form.reset();
  },

  closeEditBookModal: function() {
    $('#editBookModal').modal('hide');
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

  getStatusClass: function(status) {
    if (!status) return 'bg-secondary';

    var statusLower = status.toLowerCase();
    if (statusLower === 'available' || statusLower === 'returned') {
      return 'bg-success';
    } else if (statusLower === 'borrowed' || statusLower === 'active') {
      return 'bg-warning';
    } else if (statusLower === 'maintenance' || statusLower === 'overdue') {
      return 'bg-danger';
    }
    return 'bg-secondary';
  },

  showLoading: function() {
    var tableBody = document.getElementById('books-table-body');
    if (tableBody) {
      tableBody.innerHTML = '<tr>' +
        '<td colspan="8" class="text-center">' +
        '<div class="spinner-border text-primary" role="status">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '<p class="mt-2">Loading books...</p>' +
        '</td>' +
        '</tr>';
    }
  },

  showError: function(message) {
    var tableBody = document.getElementById('books-table-body');
    if (tableBody) {
      tableBody.innerHTML = '<tr>' +
        '<td colspan="8" class="text-center text-danger">' +
        '<h5>Error loading books</h5>' +
        '<p>' + (message || 'Unknown error') + '</p>' +
        '<button class="btn btn-primary mt-2" onclick="ManageBooksController.loadBooks()">Retry</button>' +
        '</td>' +
        '</tr>';
    }
  }
};

window.ManageBooksView = ManageBooksView;