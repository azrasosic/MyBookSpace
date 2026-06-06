var AuthorsController = {
  allAuthors: [],
  isInitialized: false,

  init: function() {
    this.isInitialized = false;
    AuthorsView.renderAlphabetFilter();
    $('.author-filter-btn').removeClass('active');
    $('.author-filter-btn[data-letter="All"]').addClass('active');
    this.loadAllAuthors();
    this.setupFilterButtons();
  },

  loadAllAuthors: function() {
    var container = document.getElementById('author-cards-container');
    if (container) {
      container.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border" role="status"></div></div>';
    }

    AuthorsModel.loadAll(
      function(response) {
        var authors = Array.isArray(response) ? response : [];
        AuthorsController.allAuthors = authors;
        AuthorsView.renderAuthorCards(authors);
        AuthorsController.setupCardClicks();
      },
      function(err) {
        if (container) {
          container.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Failed to load authors.</p></div>';
        }
      }
    );
  },

  setupFilterButtons: function() {
    $(document).off('click', '.author-filter-btn').on('click', '.author-filter-btn', function() {
      $('.author-filter-btn').removeClass('active');
      $(this).addClass('active');

      var letter = $(this).data('letter');
      AuthorsController.filterByLetter(letter);
    });
  },

  filterByLetter: function(letter) {
    if (letter === 'All') {
      AuthorsView.renderAuthorCards(this.allAuthors);
    } else {
      var filtered = this.allAuthors.filter(function(a) {
        var nameParts = a.name.trim().split(' ');
        var lastName = nameParts[nameParts.length - 1];
        return lastName.toUpperCase().startsWith(letter);
      });
      AuthorsView.renderAuthorCards(filtered);
    }
    this.setupCardClicks();
  },

  setupCardClicks: function() {
    $(document).off('click', '.author-card').on('click', '.author-card', function() {
      var authorId = $(this).data('author-id');
      localStorage.setItem('currentAuthorId', authorId);

      var detailContainer = document.getElementById('author-detail-container');
      if (detailContainer) {
        detailContainer.innerHTML = '<div class="text-center py-5"><div class="spinner-border" role="status"></div></div>';
      }

      window.location.hash = 'author-detail';

      setTimeout(function() {
        AuthorsController.initDetail();
      }, 200);
    });
  },

  initDetail: function() {
    var authorId = localStorage.getItem('currentAuthorId');
    if (!authorId) {
      window.location.hash = 'authors';
      return;
    }

    var container = document.getElementById('author-detail-container');
    if (!container) return;
    container.innerHTML = '<div class="text-center py-5"><div class="spinner-border" role="status"></div></div>';

    AuthorsModel.loadById(
      authorId,
      function(author) {
        AuthorsModel.loadBooksByAuthor(
          authorId,
          function(books) {
            var bookList = Array.isArray(books) ? books : [];
            AuthorsView.renderAuthorDetail(author, bookList);
          },
          function() {
            AuthorsView.renderAuthorDetail(author, []);
          }
        );
      },
      function() {
        container.innerHTML = '<div class="container py-4"><div class="alert alert-danger">Author not found.</div></div>';
      }
    );
  }
};

window.AuthorsController = AuthorsController;