var UserView = {
  init: function() {

  },

  setupLoginForm: function(formId, callback) {

  },

  setupRegisterForm: function(callback) {

  },

  showLoginError: function(message) {
    toastr.error(message);
  },

  showLoginSuccess: function(message) {
    toastr.success(message);
  },

  showRegistrationSuccess: function(message) {
    toastr.success(message);
  },

  showRegistrationError: function(message) {
    toastr.error(message);
  },

  updateNavigation: function() {
    var user = UserModel.getCurrentUser();
    var navContainer = document.querySelector('#nav-menu');

    if (!navContainer) return;

    var navHtml = '';

    if (user) {
      var isLibrarian = UserModel.isLibrarian();

      if (isLibrarian) {
        navHtml = '<li><a href="#books">Books</a></li>' +
          '<li class="dropdown">' +
          '<a href="#manage-books"><span>Admin Dashboard</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>' +
          '<ul>' +
          '<li><a href="#manage-books">Manage Books</a></li>' +
          '<li><a href="#manage-authors">Manage Authors</a></li>' +
          '<li><a href="#manage-borrowings">Manage Borrowings</a></li>' +
          '<li><a href="#manage-librarians">Manage Librarians</a></li>' +
          '</ul>' +
          '</li>' +
          '<li><a href="#contact">About Us</a></li>' +
          '<li class="dropdown">' +
          '<a href="#profile"><span>' + (user.email || 'Account') + '</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>' +
          '<ul>' +
          '<li><a href="#profile">Profile</a></li>' +
          '<li><a href="#" onclick="UserController.logout()">Logout</a></li>' +
          '</ul>' +
          '</li>';
      } else {
        navHtml = '<li><a href="#books">Books</a></li>' +
          '<li><a href="#contact">About Us</a></li>' +
          '<li class="dropdown">' +
          '<a href="#profile"><span>' + (user.email || 'Account') + '</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>' +
          '<ul>' +
          '<li><a href="#profile">Profile</a></li>' +
          '<li><a href="#" onclick="UserController.logout()">Logout</a></li>' +
          '</ul>' +
          '</li>';
      }
    } else {
      navHtml = '<li><a href="#contact">About Us</a></li>' +
        '<li class="dropdown">' +
        '<a href="#login"><span>Account</span> <i class="bi bi-chevron-down toggle-dropdown"></i></a>' +
        '<ul>' +
        '<li><a href="#register">Register</a></li>' +
        '<li><a href="#login">Login</a></li>' +
        '</ul>' +
        '</li>';
    }

    navContainer.innerHTML = navHtml;

    this.initializeMobileNav();
  },

  initializeMobileNav: function() {
    var mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    if (mobileNavToggle) {
      var newToggle = mobileNavToggle.cloneNode(true);
      mobileNavToggle.parentNode.replaceChild(newToggle, mobileNavToggle);

      newToggle.addEventListener('click', function(e) {
        var navmenu = document.querySelector('#navmenu');
        if (navmenu) {
          navmenu.classList.toggle('mobile-nav-active');
          this.classList.toggle('bi-list');
          this.classList.toggle('bi-x');
        }
      });
    }
  },

  redirectToBooks: function() {
    setTimeout(function() {
      window.location.replace('#books');
    }, 1000);
  },

  redirectToLogin: function() {
    setTimeout(function() {
      window.location.href = 'index.html#login';
    }, 1000);
  },

  redirectToHome: function() {
    setTimeout(function() {
      window.location.replace('index.html');
    }, 1000);
  },

  clearLoginForm: function(formId) {
    var form = document.getElementById(formId);
    if (form) {
      form.reset();
      $(form).find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
    }
  },

  clearRegisterForm: function() {
    var form = document.getElementById('registerForm');
    if (form) {
      form.reset();
      $(form).find('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
    }
  }
};

window.UserView = UserView;