var BookView = {
  init: function() {
    this.renderGenreFilter();
  },

  renderGenreFilter: function() {
    if (!$('#book-filter').length) {
      var filterHtml = '<div id="book-filter" class="row mb-4" data-aos="fade-up">' +
        '<div class="col-md-12 text-center">' +
        '<div class="btn-group" role="group" aria-label="Genre filter">' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="">All Genres</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Fiction">Fiction</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Sci-Fi">Sci-Fi</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Fantasy">Fantasy</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Mystery">Mystery</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Romance">Romance</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Horror">Horror</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Biography">Biography</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="History">History</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Poetry">Poetry</button>' +
        '<button type="button" class="btn btn-outline-primary genre-filter-btn" data-genre="Children">Children</button>' +
        '</div>' +
        '</div>' +
        '</div>';

      $('.isotope-layout').before(filterHtml);
    }
  },

  displayBooks: function(books) {
    var container = $('.isotopea-container');
    container.empty();

    if (!books || books.length === 0) {
      container.html('<div class="col-12 text-center"><h4>No books found</h4></div>');
      return;
    }

    function genreToClassName(genre) {
      if (!genre) return 'uncategorized';
      return genre.trim().toLowerCase().replace(/\s+/g, '-');
    }

    books.forEach(function(book) {
      var authorName = book.author_name || (book.author && book.author.name) || 'Unknown Author';
      var isbn = book.ISBN || book.isbn || 'N/A';

      var imageSrc = '';
      if (book.image_url) {
        imageSrc = book.image_url;
      } else if (book.id) {
        imageSrc = 'assets/img/books/book-' + book.id + '.jpg';
      }

      var bookHtml = '<div class="col-lg-4 col-md-6 portfolio-item isotope-item filter-' + genreToClassName(book.genre) + '">' +
        '<div class="portfolio-content h-100">' +
        '<img src="' + imageSrc + '" class="img-fluid" alt="' + book.title + '" onerror="this.onerror=null; this.src=\'assets/img/books/default-book.jpg\'">' +
        '<div class="portfolio-info">' +
        '<h4>' + (book.genre || 'General') + '</h4>' +
        '<p><strong>' + book.title + '</strong> (' + (book.publication_year || 'N/A') + ')</p>' +
        '<a href="#book-details" data-book-id="' + book.id + '" class="details-link book-details-link">' +
        '<i class="bi bi-link-45deg"></i>' +
        '</a>' +
        '</div>' +
        '</div>' +
        '</div>';

      container.append(bookHtml);
    });

    if (typeof window.initIsotope === 'function') {
      window.initIsotope();
    }
  },

  renderBookDetails: function(book) {
    var authorName = book.author_name || (book.author && book.author.name) || 'Unknown Author';
    var authorBio = book.biography || book.author_bio || (book.author && book.author.biography);
    var isbn = book.ISBN || book.isbn || 'N/A';

    var imageSrc = '';
    if (book.image_url) {
      imageSrc = book.image_url;
    } else if (book.id) {
      imageSrc = 'assets/img/books/book-' + book.id + '.jpg';
    }

    var bookDetailsHtml = '<section id="book' + book.id + '">' +
      '<div class="container" data-aos="fade-up" data-aos-delay="100">' +
      '<a href="#books" class="btn btn-outline-secondary mb-4">' +
      '<i class="bi bi-arrow-left"></i> Back to Books' +
      '</a>' +
      '<div class="row gy-4">' +
      '<div class="col-lg-4">' +
      '<div class="card shadow border-0">' +
      '<div class="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="200">' +
      '<img src="' + imageSrc + '" class="img-fluid rounded" alt="' + book.title + '" onerror="this.onerror=null; this.src=\'assets/img/books/default-book.jpg\'">' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="col-lg-8 d-flex align-items-center">' +
      '<div class="card shadow border-0 p-4 w-100">' +
      '<div class="info-item d-flex flex-column justify-content-center" data-aos="fade-up" data-aos-delay="300">' +
      '<h1 class="book-title mb-3">' + book.title + '</h1>' +
      '<div class="row mb-4">' +
      '<div class="col-md-6">' +
      '<p class="book-info"><strong>Author:</strong> ' + authorName + '</p>' +
      '<p class="book-info"><strong>ISBN:</strong> ' + isbn + '</p>' +
      '<p class="book-info"><strong>Publication Year:</strong> ' + (book.publication_year || 'N/A') + '</p>' +
      '</div>' +
      '<div class="col-md-6">' +
      '<p class="book-info"><strong>Genre:</strong> <span class="badge bg-primary">' + (book.genre || 'General') + '</span></p>' +
      '<p class="book-info"><strong>Status:</strong> <span class="badge ' + (book.status === 'Available' ? 'bg-success' : 'bg-warning') + '">' + (book.status || 'Unknown') + '</span></p>' +
      (book.author_id ? '<p class="book-info"><strong>Author ID:</strong> ' + book.author_id + '</p>' : '') +
      '</div>' +
      '</div>' +
      (book.summary ? '<div class="mb-4"><h5>Summary</h5><p class="lead">' + book.summary + '</p></div>' : '') +
      (authorBio ? '<div class="mb-4"><h5>About the Author</h5><p>' + authorBio + '</p></div>' : '') +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</section>';

    $('#book-details-container').html(bookDetailsHtml);
  },

  showError: function(message) {
    $('.isotopea-container').html('<div class="col-12 text-center">' +
      '<h4>Error loading books</h4>' +
      '<p>' + (message || 'Unknown error') + '</p>' +
      '<button class="btn btn-primary mt-3" onclick="BookController.loadBooks()">Retry</button>' +
      '<button class="btn btn-secondary mt-3 ms-2" onclick="window.location.href=\'#login\'">Go to Login</button>' +
      '</div>');
  }
};

window.BookView = BookView;