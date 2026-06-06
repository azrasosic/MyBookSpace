var ManageReservationsController = {
  pendingCancelId: null,

  init: function() {
    this.loadReservations();
    this.setupEvents();
  },

  loadReservations: function() {
    ManageReservationsModel.loadAll(
      function(data) {
        var list = Array.isArray(data) ? data : [];
        ManageReservationsView.render(list);
        ManageReservationsController.bindTableActions();
      },
      function() {
        toastr.error('Failed to load reservations');
      }
    );
  },

  bindTableActions: function() {
    $(document).off('click', '.mark-collected-btn').on('click', '.mark-collected-btn', function() {
      var id = $(this).data('id');
      ManageReservationsModel.updateStatus(id, 'Collected',
        function() {
          toastr.success('Reservation marked as Collected');
          ManageReservationsController.loadReservations();
        },
        function() {
          toastr.error('Failed to update status');
        }
      );
    });

    $(document).off('click', '.cancel-reservation-btn').on('click', '.cancel-reservation-btn', function() {
      ManageReservationsController.pendingCancelId = $(this).data('id');
      var modal = new bootstrap.Modal(document.getElementById('confirmCancelReservationModal'));
      modal.show();
    });
  },

  setupEvents: function() {
    $('#confirmCancelReservationBtn').off('click').on('click', function() {
      if (!ManageReservationsController.pendingCancelId) return;
      ManageReservationsModel.cancel(
        ManageReservationsController.pendingCancelId,
        function() {
          bootstrap.Modal.getInstance(document.getElementById('confirmCancelReservationModal')).hide();
          toastr.success('Reservation cancelled');
          ManageReservationsController.loadReservations();
        },
        function() {
          toastr.error('Failed to cancel reservation');
        }
      );
    });
  }
};

window.ManageReservationsController = ManageReservationsController;