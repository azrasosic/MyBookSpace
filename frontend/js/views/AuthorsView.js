var AuthorsView = {
  renderAlphabetFilter: function() {
    var container = document.getElementById('author-alphabet-filter');
    if (!container) return;
    $(container).find('.author-filter-btn:not([data-letter="All"])').remove();
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.forEach(function(letter) {
      var btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-outline-secondary author-filter-btn me-1 mb-1';
      btn.dataset.letter = letter;
      btn.textContent = letter;
      container.appendChild(btn);
    });
  },

  renderAuthorCards: function(authors) {
    var container = document.getElementById('author-cards-container');
    if (!container) return;

    if (!authors || authors.length === 0) {
      container.innerHTML = '<div class="col-12 text-center"><p class="text-muted mt-4">No authors found for this letter.</p></div>';
      return;
    }

    var html = '';
    authors.forEach(function(author) {
      var avatarHtml;
      if (author.photo_url) {
        avatarHtml = '<img src="' + author.photo_url + '" ' +
          'class="rounded-circle mb-3" width="80" height="80" ' +
          'alt="' + author.name + '" style="object-fit:cover;" ' +
          'onerror="this.outerHTML=\'<div class=&quot;rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3&quot; style=&quot;width:80px;height:80px;font-size:2rem;color:#fff;&quot;>\' + author.name.charAt(0).toUpperCase() + \'</div>\'">';
      } else {
        avatarHtml = '<div class="rounded-circle bg-secondary d-flex align-items-center justify-content-center mb-3" ' +
          'style="width:80px;height:80px;font-size:2rem;color:#fff;">' +
          author.name.charAt(0).toUpperCase() +
          '</div>';
      }

      html += '<div class="col-lg-3 col-md-4 col-sm-6">' +
        '<div class="card h-100 text-center border-0 shadow-sm author-card" ' +
        'data-author-id="' + author.id + '" style="cursor:pointer; transition:transform .2s;"' +
        ' onmouseover="this.style.transform=\'translateY(-4px)\'"' +
        ' onmouseout="this.style.transform=\'none\'">' +
        '<div class="card-body d-flex flex-column align-items-center justify-content-center py-4">' +
        avatarHtml +
        '<h6 class="card-title mb-1">' + author.name + '</h6>' +
        (author.book_count !== undefined
          ? '<small class="text-muted">' + author.book_count + ' book' + (author.book_count !== 1 ? 's' : '') + '</small>'
          : '') +
        '</div>' +
        '</div>' +
        '</div>';
    });
    container.innerHTML = html;
  },

  renderAuthorDetail: function(author, books) {
    var container = document.getElementById('author-detail-container');
    if (!container) return;

    var photoHtml = author.photo_url
      ? '<img src="' + author.photo_url + '" class="img-fluid rounded-circle mb-3" width="120" height="120" alt="' + author.name + '" style="object-fit:cover;">'
      : '<div class="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto mb-3" style="width:120px;height:120px;font-size:3rem;color:#fff;">' + author.name.charAt(0).toUpperCase() + '</div>';

    var booksHtml = '';
    if (!books || books.length === 0) {
      booksHtml = '<p class="text-muted">No books found for this author.</p>';
    } else {
      booksHtml = '<div class="portfolio section"><div class="container"><div class="isotope-layout"><div class="row gy-4 isotopea-container">';
      books.forEach(function(book) {
        var imgSrc = book.image_url || ('assets/img/books/book-' + book.id + '.jpg');
        booksHtml +=
          '<div class="col-lg-4 col-md-6 portfolio-item isotope-item">' +
          '<div class="portfolio-content h-100">' +
          '<img src="' + imgSrc + '" class="img-fluid" alt="' + book.title + '" ' +
          'onerror="this.onerror=null;this.src=\'assets/img/books/default-book.jpg\'">' +
          '<div class="portfolio-info">' +
          '<h4>' + (book.genre || 'General') + '</h4>' +
          '<p><strong>' + book.title + '</strong></p>' +
          '<a href="#book-details" data-book-id="' + book.id + '" class="details-link book-details-link">' +
          '<i class="bi bi-link-45deg"></i>' +
          '</a>' +
          '</div>' +
          '</div>' +
          '</div>';
      });
      booksHtml += '</div></div></div></div>';
    }

    container.innerHTML =
      '<div class="container py-4">' +
      '<a href="#authors" class="btn btn-outline-secondary mb-4" id="back-to-authors-btn">' +
      '<i class="bi bi-arrow-left"></i> Back to All Authors' +
      '</a>' +
      '<div class="row mb-4">' +
      '<div class="col-md-3 text-center">' + photoHtml + '</div>' +
      '<div class="col-md-9">' +
      '<h3>' + author.name + '</h3>' +
      (author.biography ? '<p class="text-muted">' + author.biography + '</p>' : '') +
      '</div>' +
      '</div>' +
      '<h4 class="mb-3">Books by ' + author.name + '</h4>' +
      booksHtml +
      '</div>';
  }
};

window.AuthorsView = AuthorsView;