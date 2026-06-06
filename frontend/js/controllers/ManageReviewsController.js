var ManageReviewsController = {
  pendingDeleteId: null,

  init: function() {
    this.loadReviews();
    this.setupEvents();
  },

  loadReviews: function() {
    ManageReviewsModel.loadAll(
      function(data) {
        var list = Array.isArray(data) ? data : [];
        ManageReviewsView.render(list);
        ManageReviewsController.bindTableActions();
      },
      function() {
        toastr.error('Failed to load reviews');
      }
    );
  },

  bindTableActions: function() {
    $(document).off('click', '.delete-review-btn').on('click', '.delete-review-btn', function() {
      ManageReviewsController.pendingDeleteId = $(this).data('id');
      var modal = new bootstrap.Modal(document.getElementById('confirmDeleteReviewModal'));
      modal.show();
    });
  },

  setupEvents: function() {
    $('#confirmDeleteReviewBtn').off('click').on('click', function() {
      if (!ManageReviewsController.pendingDeleteId) return;
      ManageReviewsModel.deleteReview(
        ManageReviewsController.pendingDeleteId,
        function() {
          bootstrap.Modal.getInstance(document.getElementById('confirmDeleteReviewModal')).hide();
          toastr.success('Review deleted successfully');
          ManageReviewsController.loadReviews();
        },
        function() {
          toastr.error('Failed to delete review');
        }
      );
    });
  }
};

window.ManageReviewsController = ManageReviewsController;