var ManageReviewsView = {
  renderStars: function(rating) {
    var stars = '';
    for (var i = 1; i <= 5; i++) {
      stars += '<i class="bi bi-star' + (i <= rating ? '-fill text-warning' : ' text-muted') + '"><\/i>';
    }
    return stars;
  },

  render: function(reviews) {
    var wrapper = document.getElementById('reviews-table-wrapper');
    if (!wrapper) return;

    if (!reviews || reviews.length === 0) {
      wrapper.innerHTML = '<div class="alert alert-info text-center">No reviews found.</div>';
      return;
    }

    var self = this;
    var rows = reviews.map(function(r) {
      var date = r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A';
      return '<tr>' +
        '<td>' + (r.book_title || 'N/A') + '</td>' +
        '<td>' + self.renderStars(r.rating) + ' (' + r.rating + '/5)</td>' +
        '<td>' + (r.comment ? r.comment.substring(0, 80) + (r.comment.length > 80 ? '...' : '') : '<em class="text-muted">No comment<\/em>') + '</td>' +
        '<td>' + date + '</td>' +
        '<td>' +
        '<button class="btn btn-sm btn-danger delete-review-btn" data-id="' + r.id + '">Delete</button>' +
        '</td>' +
        '<\/tr>';
    }).join('');

    wrapper.innerHTML =
      '<table class="table table-hover">' +
      '<thead><tr>' +
      '<th>Book<\/th><th>Rating<\/th><th>Feedback<\/th><th>Date<\/th><th>Actions<\/th>' +
      '<\/tr><\/thead>' +
      '<tbody>' + rows + '<\/tbody>' +
      '<\/table>';
  }
};

window.ManageReviewsView = ManageReviewsView;