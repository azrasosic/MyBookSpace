/**
 * Utilities
 *
 * Provides helper functions including DataTable initialization and JWT token parsing.
 */
var Utils = {
  datatable: function(tableId, columns, data, pageLength) {
    if (pageLength === undefined) pageLength = 15;
    if ($.fn.dataTable.isDataTable('#' + tableId)) {
      $('#' + tableId)
        .DataTable()
        .destroy();
    }
    $('#' + tableId).DataTable({
      data: data,
      columns: columns,
      pageLength: pageLength,
      lengthMenu: [2, 5, 10, 15, 25, 50, 100, 'All'],
    });
  },

  parseJwt: function(token) {
    if (!token) return null;
    try {
      var payload = token.split('.')[1];
      var base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      var padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      var decoded = atob(padded);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Invalid JWT token', e);
      return null;
    }
  },
};