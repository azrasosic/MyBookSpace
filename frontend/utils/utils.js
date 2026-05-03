/**
 * Utilities
 *
 * Provides helper functions including DataTable initialization and JWT token parsing.
 */
const Utils = {
  datatable(tableId, columns, data, pageLength = 15) {
    if ($.fn.dataTable.isDataTable(`#${tableId}`)) {
      $(`#${tableId}`)
        .DataTable()
        .destroy();
    }
    $(`#${tableId}`).DataTable({
      data,
      columns,
      pageLength,
      lengthMenu: [2, 5, 10, 15, 25, 50, 100, 'All'],
    });
  },

  parseJwt(token) {
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Invalid JWT token', e);
      return null;
    }
  },
};