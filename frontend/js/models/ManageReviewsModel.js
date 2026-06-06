var ManageReviewsModel = {
  loadAll: function(successCallback, errorCallback) {
    RestClient.get('reviews', successCallback, errorCallback);
  },

  deleteReview: function(reviewId, successCallback, errorCallback) {
    RestClient.delete('reviews/' + reviewId, {}, successCallback, errorCallback);
  }
};

window.ManageReviewsModel = ManageReviewsModel;