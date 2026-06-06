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

    var token = localStorage.getItem('user_token');
    var decoded = token ? Utils.parseJwt(token) : null;
    var userRole = decoded && decoded.user ? decoded.user.role : '';
    var userId = decoded && decoded.user ? decoded.user.id : null;
    var isUser = userRole === 'user';

    var favBtn = isUser
      ? '<button id="fav-btn" class="btn btn-outline-danger me-2" data-book-id="' + book.id + '">' +
        '<i class="bi bi-heart"></i> <span id="fav-btn-text">Add to Favourites</span>' +
        '</button>'
      : '';

    var reserveBtn = '';
    if (isUser && book.status === 'Borrowed') {
      reserveBtn = '<button id="reserve-btn" class="btn btn-warning me-2" data-book-id="' + book.id + '">' +
        '<i class="bi bi-bookmark-plus"></i> Reserve Book' +
        '</button>';
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
      (favBtn || reserveBtn
        ? '<div class="mt-3 mb-2">' + favBtn + reserveBtn + '</div>'
        : '') +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="mt-5" id="reviews-section">' +
      '<h4 class="mb-3">Reviews</h4>' +
      '<div id="reviews-content"><div class="spinner-border spinner-border-sm" role="status"></div></div>' +
      (isUser ? '<div id="write-review-section" class="mt-4" style="display:none;"></div>' : '') +
      '</div>' +
      '</div></section>';

    $('#book-details-container').html(bookDetailsHtml);

    if (isUser && userId) {
      BookView.loadFavouriteStatus(userId, book.id);
      BookView.loadReviews(book.id, userId);
      BookView.setupReserveButton(userId, book.id);
    } else {
      BookView.loadReviews(book.id, null);
    }
  },

  loadFavouriteStatus: function(userId, bookId) {
    RestClient.get('users/' + userId + '/favourites/' + bookId + '/status',
      function(data) {
        var isFav = data && data.is_favourite;
        BookView.updateFavBtn(isFav);
        BookView.setupFavButton(userId, bookId);
      },
      function() {
        BookView.setupFavButton(userId, bookId);
      }
    );
  },

  updateFavBtn: function(isFav) {
    var btn = document.getElementById('fav-btn');
    var text = document.getElementById('fav-btn-text');
    if (!btn) return;
    if (isFav) {
      btn.classList.remove('btn-outline-danger');
      btn.classList.add('btn-danger');
      if (text) text.textContent = 'Remove from Favourites';
    } else {
      btn.classList.add('btn-outline-danger');
      btn.classList.remove('btn-danger');
      if (text) text.textContent = 'Add to Favourites';
    }
  },

  setupFavButton: function(userId, bookId) {
    $(document).off('click', '#fav-btn').on('click', '#fav-btn', function() {
      $.ajax({
        url: Constants.PROJECT_BASE_URL + 'users/' + userId + '/favourites',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ book_id: bookId }),
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authentication', localStorage.getItem('user_token'));
        },
        success: function(data) {
          BookView.updateFavBtn(data.is_favourite);
          toastr.success(data.message);
        },
        error: function(xhr) {
          toastr.error('Failed to update favourites');
        }
      });
    });
  },

  setupReserveButton: function(userId, bookId) {
    $(document).off('click', '#reserve-btn').on('click', '#reserve-btn', function() {
      var bookTitle = $('#book-details-container h1.book-title').text();
      if (!confirm('Are you sure you want to reserve "' + bookTitle + '"?')) return;

      RestClient.post('reservations', { book_id: bookId },
        function(data) {
          toastr.success(data.message || 'Book reserved successfully. You will be notified when it becomes available.');
          $('#reserve-btn').prop('disabled', true).text('Reserved');
        },
        function(xhr) {
          var msg = 'Failed to reserve book';
          if (xhr && xhr.responseJSON && xhr.responseJSON.error) msg = xhr.responseJSON.error;
          toastr.error(msg);
        }
      );
    });
  },

  loadReviews: function(bookId, userId) {
    RestClient.get('books/' + bookId + '/reviews',
      function(data) {
        BookView.renderReviews(data, bookId, userId);
        if (userId) {
          RestClient.get('books/' + bookId + '/reviews/my',
            function(myData) {
              BookView.renderWriteReview(bookId, userId, myData);
            },
            function() {}
          );
        }
      },
      function(xhr) {
        var sec = document.getElementById('reviews-content');
        if (sec) sec.innerHTML = '<p class="text-muted">Could not load reviews.</p>';
      }
    );
  },

  renderStars: function(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      html += '<i class="bi bi-star' + (i <= rating ? '-fill text-warning' : ' text-muted') + '"></i>';
    }
    return html;
  },

  renderReviews: function(data, bookId, userId) {
    var sec = document.getElementById('reviews-content');
    if (!sec) return;

    var reviews = (data && data.reviews) ? data.reviews : [];
    var avg = (data && data.average_rating) ? data.average_rating : 0;
    var count = reviews.length;

    var html = '';

    if (count > 0) {
      html += '<div class="mb-3 d-flex align-items-center gap-2">' +
        '<span class="fs-5 fw-bold">' + avg + '</span>' +
        BookView.renderStars(Math.round(avg)) +
        '<span class="text-muted">(' + count + ' review' + (count !== 1 ? 's' : '') + ')</span>' +
        '</div>';
    }

    if (count === 0) {
      html += '<p class="text-muted">No reviews yet. Be the first to leave a review!</p>';
    } else {
      reviews.forEach(function(r) {
        var date = r.created_at ? new Date(r.created_at).toLocaleDateString() : '';
        html += '<div class="border rounded p-3 mb-2">' +
          '<div class="d-flex align-items-center gap-2 mb-1">' +
          BookView.renderStars(r.rating) +
          '<small class="text-muted ms-2">' + date + '</small>' +
          '</div>' +
          (r.comment ? '<p class="mb-0">' + r.comment + '</p>' : '') +
          '</div>';
      });
    }

    sec.innerHTML = html;
  },

  renderWriteReview: function(bookId, userId, myData) {
    var sec = document.getElementById('write-review-section');
    if (!sec) return;

    var canReview = myData && myData.can_review;
    var existing = myData && myData.existing_review;

    if (!canReview) {
      sec.style.display = 'none';
      return;
    }

    sec.style.display = '';
    var title = existing ? 'Edit Your Review' : 'Write a Review';
    var rating = existing ? existing.rating : 0;
    var comment = existing ? (existing.comment || '') : '';

    var starsHtml = '<div class="d-flex gap-1 mb-2" id="star-picker">';
    for (var i = 1; i <= 5; i++) {
      starsHtml += '<i class="bi bi-star' + (i <= rating ? '-fill text-warning' : '') +
        '" style="font-size:1.5rem;cursor:pointer;" data-star="' + i + '"></i>';
    }
    starsHtml += '</div><input type="hidden" id="review-rating" value="' + rating + '">';

    sec.innerHTML =
      '<h5>' + title + '</h5>' +
      starsHtml +
      '<div id="rating-error" class="text-danger small" style="display:none;">Please select a star rating.</div>' +
      '<textarea class="form-control mb-2" id="review-comment" maxlength="500" rows="3" placeholder="Optional written feedback (max 500 characters)">' + comment + '</textarea>' +
      '<button class="btn btn-primary" id="submit-review-btn">Submit Review</button>';

    $(document).off('click', '#star-picker .bi').on('click', '#star-picker .bi', function() {
      var n = parseInt($(this).data('star'));
      $('#review-rating').val(n);
      $('#star-picker .bi').each(function(i) {
        $(this).toggleClass('bi-star-fill text-warning', i < n).toggleClass('bi-star', i >= n);
      });
      $('#rating-error').hide();
    });

    $(document).off('click', '#submit-review-btn').on('click', '#submit-review-btn', function() {
      var r = parseInt($('#review-rating').val()) || 0;
      if (!r) {
        $('#rating-error').show();
        return;
      }
      var c = $('#review-comment').val();

      RestClient.post('books/' + bookId + '/reviews', { rating: r, comment: c },
        function(data) {
          toastr.success('Review submitted successfully');
          BookView.loadReviews(bookId, userId);
        },
        function(xhr) {
          var msg = 'Failed to submit review';
          if (xhr && xhr.responseJSON && xhr.responseJSON.error) msg = xhr.responseJSON.error;
          toastr.error(msg);
        }
      );
    });
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