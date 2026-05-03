var ManageBorrowingsView = {
  init: function() {

  },

  displayBorrowings: function(borrowings, books, users, librarians) {
    var tableBody = document.getElementById('borrowings-table-body');

    if (!borrowings || borrowings.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="7" class="text-center">No borrowings found</td></tr>';
      return;
    }

    var html = '';
    borrowings.forEach(function(borrowing) {
      var bookTitle = this.getBookTitle(borrowing, books);
      var userName = this.getUserName(borrowing, users);
      var librarianName = this.getLibrarianName(borrowing, librarians);
      var returnOrDue = borrowing.return_date || borrowing.due_date || 'N/A';
      var displayStatus = this.getDisplayStatus(borrowing);

      var isActive = this.isBorrowingActive(borrowing);
      var deleteButtonDisabled = isActive ? 'disabled' : '';
      var deleteButtonTitle = isActive ? 'Cannot delete active borrowing' : 'Delete borrowing';

      html += '<tr>' +
        '<td>' + bookTitle + '</td>' +
        '<td>' + userName + '</td>' +
        '<td>' + librarianName + '</td>' +
        '<td>' + (borrowing.borrow_date || 'N/A') + '</td>' +
        '<td>' + returnOrDue + '</td>' +
        '<td><span class="badge ' + this.getStatusClass(borrowing.status, borrowing.due_date) + '">' + displayStatus + '</span></td>' +
        '<td>' +
        '<button class="btn btn-sm btn-warning me-1" onclick="ManageBorrowingsController.editBorrowing(' + borrowing.id + ')">Edit</button>' +
        '<button class="btn btn-sm btn-danger" ' + deleteButtonDisabled + ' onclick="ManageBorrowingsController.deleteBorrowing(' + borrowing.id + ')" title="' + deleteButtonTitle + '">Delete</button>' +
        '</td>' +
        '</tr>';
    }.bind(this));

    tableBody.innerHTML = html;
  },

  isBorrowingActive: function(borrowing) {
    var status = borrowing.status ? borrowing.status.toLowerCase() : '';
    var displayStatus = this.getDisplayStatus(borrowing).toLowerCase();

    return status === 'active' ||
      status === 'borrowed' ||
      displayStatus === 'overdue' ||
      (!borrowing.return_date && borrowing.status &&
      (borrowing.status.toLowerCase().includes('active') ||
      borrowing.status.toLowerCase().includes('borrowed')));
  },

  getBookTitle: function(borrowing, books) {
    if (borrowing.book_title) return borrowing.book_title;
    if (borrowing.book && borrowing.book.title) return borrowing.book.title;
    if (borrowing.book_id) {
      var book = books.find(function(b) { return b.id === borrowing.book_id; });
      return book ? book.title : 'Unknown Book';
    }
    return 'N/A';
  },

  getUserName: function(borrowing, users) {
    if (borrowing.user_name) return borrowing.user_name;
    if (borrowing.user && borrowing.user.name) {
      return borrowing.user.name + (borrowing.user.surname ? ' ' + borrowing.user.surname : '');
    }
    if (borrowing.user_id) {
      var user = users.find(function(u) { return u.id === borrowing.user_id; });
      return user ? (user.name || '') + ' ' + (user.surname || '') : 'Unknown User';
    }
    return 'N/A';
  },

  getLibrarianName: function(borrowing, librarians) {
    if (borrowing.librarian_name) return borrowing.librarian_name;
    if (borrowing.librarian && borrowing.librarian.name) {
      return borrowing.librarian.name + (borrowing.librarian.surname ? ' ' + borrowing.librarian.surname : '');
    }
    if (borrowing.librarian_id) {
      var librarian = librarians.find(function(l) { return l.id === borrowing.librarian_id; });
      return librarian ? (librarian.name || '') + ' ' + (librarian.surname || '') : 'Unknown Librarian';
    }
    return 'N/A';
  },

  getDisplayStatus: function(borrowing) {
    var displayStatus = borrowing.status || 'Unknown';
    if (borrowing.due_date && (borrowing.status === 'Active' || borrowing.status === 'Borrowed' || borrowing.status === 'active' || borrowing.status === 'borrowed')) {
      var today = new Date();
      var due = new Date(borrowing.due_date);

      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);

      if (due < today) {
        displayStatus = 'Overdue';
      }
    }
    return displayStatus;
  },

  populateBooksDropdown: function(dropdownId, books, selectedId) {
    var dropdown = document.getElementById(dropdownId);
    var html = '<option value="">Select Book</option>';

    if (books && books.length > 0) {
      books.forEach(function(book) {
        if (dropdownId.includes('add') && book.status !== 'Available') {
          return;
        }
        html += '<option value="' + book.id + '" ' + (book.id == selectedId ? 'selected' : '') + '>' + (book.title || 'Unknown') + '</option>';
      });
    } else {
      html = '<option value="">No books available</option>';
    }

    dropdown.innerHTML = html;
  },

  populateUsersDropdown: function(dropdownId, users, selectedId) {
    var dropdown = document.getElementById(dropdownId);
    var html = '<option value="">Select User</option>';

    if (users && users.length > 0) {
      users.forEach(function(user) {
        html += '<option value="' + user.id + '" ' + (user.id == selectedId ? 'selected' : '') + '>' + (user.name || '') + ' ' + (user.surname || '') + '</option>';
      });
    } else {
      html = '<option value="">No users available</option>';
    }

    dropdown.innerHTML = html;
  },

  showAddBorrowingModal: function(books, users) {
    this.setupDefaultDates();
    this.populateBooksDropdown('borrowingBook', books, null);
    this.populateUsersDropdown('borrowingUser', users, null);
    $('#addBorrowingModal').modal('show');
  },

  showEditBorrowingModal: function(borrowing, books, users) {
    document.getElementById('editBorrowingId').value = borrowing.id;

    var bookDisplay = this.getBookTitle(borrowing, books);
    var userDisplay = this.getUserName(borrowing, users);

    document.getElementById('editBorrowingBookDisplay').value = bookDisplay;
    document.getElementById('editBorrowingUserDisplay').value = userDisplay;
    document.getElementById('editBorrowingBorrowDateDisplay').value = borrowing.borrow_date || '';
    document.getElementById('editBorrowingDueDateDisplay').value = borrowing.due_date || '';
    document.getElementById('editBorrowingReturnDate').value = borrowing.return_date || '';
    document.getElementById('editBorrowingStatus').value = borrowing.status || 'Active';

    if (borrowing.borrow_date) {
      var returnDateInput = document.getElementById('editBorrowingReturnDate');
      returnDateInput.min = borrowing.borrow_date;
    }

    if (borrowing.status === 'Returned') {
      document.getElementById('editBorrowingStatus').disabled = true;
    } else {
      document.getElementById('editBorrowingStatus').disabled = false;
    }

    $('#editBorrowingModal').modal('show');
  },

  closeAddBorrowingModal: function() {
    $('#addBorrowingModal').modal('hide');
    var form = document.getElementById('addBorrowingForm');
    if (form) {
      form.reset();
      this.setupDefaultDates();
    }
  },

  closeEditBorrowingModal: function() {
    $('#editBorrowingModal').modal('hide');
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

  setupDefaultDates: function() {
    var today = new Date().toISOString().split('T')[0];
    var borrowDateInput = document.getElementById('borrowingBorrowDate');
    var dueDateInput = document.getElementById('borrowingDueDate');

    if (borrowDateInput) {
      borrowDateInput.value = today;
    }

    if (dueDateInput) {
      var dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      dueDateInput.value = dueDate.toISOString().split('T')[0];
    }
  },

  getStatusClass: function(status, dueDate) {
    if (dueDate === undefined) dueDate = null;
    if (!status) return 'bg-secondary';

    var statusLower = status.toLowerCase();

    if (dueDate) {
      var today = new Date();
      var due = new Date(dueDate);

      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);

      if (due < today && (statusLower === 'active' || statusLower === 'borrowed' || statusLower.includes('active') || statusLower.includes('borrowed'))) {
        return 'bg-danger';
      }
    }

    if (statusLower === 'returned') {
      return 'bg-success';
    } else if (statusLower === 'active' || statusLower === 'borrowed' || statusLower.includes('active') || statusLower.includes('borrowed')) {
      return 'bg-warning';
    } else if (statusLower === 'overdue') {
      return 'bg-danger';
    }

    return 'bg-secondary';
  },

  showLoading: function() {
    var tableBody = document.getElementById('borrowings-table-body');
    if (tableBody) {
      tableBody.innerHTML = '<tr>' +
        '<td colspan="7" class="text-center">' +
        '<div class="spinner-border text-primary" role="status">' +
        '<span class="visually-hidden">Loading...</span>' +
        '</div>' +
        '<p class="mt-2">Loading borrowings...</p>' +
        '</td>' +
        '</tr>';
    }
  },

  showError: function(message) {
    var tableBody = document.getElementById('borrowings-table-body');
    if (tableBody) {
      tableBody.innerHTML = '<tr>' +
        '<td colspan="7" class="text-center text-danger">' +
        '<h5>Error loading borrowings</h5>' +
        '<p>' + (message || 'Unknown error') + '</p>' +
        '<button class="btn btn-primary mt-2" onclick="ManageBorrowingsController.loadBorrowings()">Retry</button>' +
        '</td>' +
        '</tr>';
    }
  }
};

window.ManageBorrowingsView = ManageBorrowingsView;