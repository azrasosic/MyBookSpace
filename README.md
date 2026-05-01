# MyBookSpace — Release 1 (v1.0)


MyBookSpace is a web-based Library Management System designed to digitize and streamline the core operations of a physical library. It's built with PHP (FlightPHP) on the backend and vanilla JavaScript (MVC pattern) on the frontend.

---

## What's Done in Release 1

**User features**
- Registration, login, and logout with JWT-based authentication (24-hour tokens)
- Browse all books with genre filtering
- View detailed book information and availability status
- View personal borrowing history
- View and edit profile (name, surname, email, phone, date of birth)
- Change account password securely

**Librarian features**
- Role-based login (separate from users)
- Full catalog management — add, edit, delete books and authors
- Create, manage, and mark borrowings as returned
- Add and remove librarian accounts
- View and edit own profile, change password

**Technical**
- RESTful API via FlightPHP with Swagger UI docs at `/backend/public/v1/docs/`
- DAO + Service + Route layered architecture
- Frontend refactored into MVC (Model / View / Controller)
- Client-side form validation with real-time feedback
- MySQL database with 8 entities (schema at `backend/database/MyBookSpace.sql`)

---

## Prerequisites

- PHP 8.1+
- MySQL 8.0+
- Apache with `mod_rewrite` enabled (`.htaccess` is already configured)
- Composer

---

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd MyBookSpace
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Set up the database

Import the provided SQL dump into MySQL:

```bash
mysql -u root -p < backend/database/MyBookSpace.sql
```

### 4. Configure database credentials

Copy the example config file and fill in your local values:

```bash
cp backend/dao/config.example.php backend/dao/config.php
```

Edit `backend/dao/config.php`:

```php
class Config
{
    public static function DB_NAME()   { return 'library_management'; }
    public static function DB_HOST()   { return 'localhost'; }
    public static function DB_PORT()   { return 3306; }
    public static function DB_USER()   { return 'your_db_user'; }
    public static function DB_PASSWORD() { return 'your_db_password'; }
    public static function JWT_SECRET()  { return 'your_random_secret_string'; }
}
```

> **Never commit `config.php` to Git.** It is listed in `.gitignore`.

### 5. Configure the frontend base URL

If needed, edit `frontend/utils/constants.js` and set `PROJECT_BASE_URL` to match your local server path:

```js
PROJECT_BASE_URL: 'http://localhost/MyBookSpace/backend/',
```

### 6. Serve the project

Place (or symlink) the project folder inside your web server's document root (e.g. `htdocs` for XAMPP, `www` for WAMP) and open:

```
http://localhost/MyBookSpace/frontend/
```

Swagger API docs are available at:

```
http://localhost/MyBookSpace/backend/public/v1/docs/
```

---

## Project Structure

```
MyBookSpace/
├── backend/
│   ├── dao/           # Database access layer
│   ├── services/      # Business logic layer
│   ├── routes/        # FlightPHP route definitions
│   ├── middleware/    # JWT auth middleware
│   ├── data/          # Static data (roles, etc.)
│   ├── database/      # SQL schema and seed data
│   └── public/v1/docs/  # Swagger UI
├── frontend/
│   ├── pages/         # HTML page fragments (SPA)
│   ├── js/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── views/
│   ├── utils/         # REST client, constants, helpers
│   └── assets/        # CSS, JS vendors, images
├── vendor/            # Composer dependencies (not committed)
├── composer.json
└── README.md
```

---

## Default Credentials (from seed data)

Check the SQL file for seeded accounts, or register a new user through the UI. A librarian account must be created directly in the database or by an existing librarian.

---
