# MyBookSpace — Release 2 (v2.0)

MyBookSpace is a web-based Library Management System designed to digitize and streamline the core operations of a physical library. Built with PHP (FlightPHP) on the backend and vanilla JavaScript (MVC pattern) on the frontend, Release 2 completes the platform with community features, personalization, and membership management on top of the core system delivered in v1.0.

---

## What's New in Release 2

**User features**
- Browse authors alphabetically (A–Z) with a letter filter and view all books by a selected author
- Add books to a personal favourites list and view them in a dedicated profile section
- Reserve a book that is currently borrowed — reservation status automatically updates to "Available for Pickup" when the book is returned
- View and cancel active reservations from the profile page
- Write and submit a star-rated review (1–5) for any book you have previously borrowed and returned
- Read community reviews and average star ratings on every book detail page
- View subscription status (Active, Expiring Soon, Expired) and expiration date on the profile page
- Visual warning banner when subscription is expiring within 7 days
- Borrowing and reservation blocked automatically when subscription has expired

**Librarian features**
- Manage user subscriptions — filter by status, view expiring/expired lists, and renew memberships after physical payment
- View and manage all active reservations — manually update status (Collected, Cancelled) and see automatic "Available for Pickup" updates
- Moderate book reviews — view all submitted reviews and delete inappropriate ones

**Technical**
- Strategy Pattern implemented for subscription status calculation (`backend/services/strategies/`)
- 4 new database tables: `reservation`, `favourite`, `review`; 2 new columns on `user`: `subscription_status`, `subscription_expiration_date`
- Full PHPUnit test suite: 37 tests, 57 assertions across 5 test classes — all passing
- Updated SQL schema at `backend/database/MyBookSpace.sql`

---

## Full Feature Set (v1.0 + v2.0)

**User features**
- Registration, login, and logout with JWT-based authentication (24-hour tokens)
- Browse all books with genre filtering
- Browse authors alphabetically and view books by author
- View detailed book information, availability status, and community reviews
- Add books to favourites
- Reserve borrowed books and track reservations
- Write and edit reviews for previously borrowed books
- View personal borrowing history
- View subscription status with expiry warnings and borrowing restrictions
- View and edit profile (name, surname, email, phone, date of birth)
- Change account password securely

**Librarian features**
- Role-based login (separate from users)
- Full catalog management — add, edit, delete books and authors
- Create, manage, and mark borrowings as returned (with automatic book status update)
- Manage reservations — view all, update status, cancel
- Manage user subscriptions — view status, filter, renew after physical payment
- Moderate book reviews — view all, delete inappropriate ones
- Add and remove librarian accounts
- View and edit own profile, change password

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
git clone https://github.com/azrasosic/MyBookSpace.git
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

This creates all 8 tables including the new `reservation`, `favourite`, and `review` tables introduced in v2.0, and adds the `subscription_status` and `subscription_expiration_date` columns to the `user` table.

### 4. Configure database credentials

Copy the example config file and fill in your local values:

```bash
cp backend/dao/config.example.php backend/dao/config.php
```

Edit `backend/dao/config.php`:

```php
class Config
{
    public static function DB_NAME()     { return 'library_management'; }
    public static function DB_HOST()     { return 'localhost'; }
    public static function DB_PORT()     { return 3306; }
    public static function DB_USER()     { return 'your_db_user'; }
    public static function DB_PASSWORD() { return 'your_db_password'; }
    public static function JWT_SECRET()  { return 'your_random_secret_string'; }
}
```

Never commit `config.php` to Git. It is listed in `.gitignore`.

### 5. Configure the frontend base URL

If needed, edit `frontend/utils/constants.js` and set `PROJECT_BASE_URL` to match your local server path:

```js
PROJECT_BASE_URL: 'http://localhost/MyBookSpace/backend/',
```

### 6. Serve the project

Place (or symlink) the project folder inside your web server's document root (e.g. `htdocs` for XAMPP, `www` for WAMP) and open:

http://localhost/MyBookSpace/frontend/

Swagger API docs are available at:

http://localhost/MyBookSpace/backend/public/v1/docs/

---

## Running Tests

The test suite uses PHPUnit and requires no database connection — all DAOs are mocked.

```bash
vendor/bin/phpunit backend/tests/
```

Expected output: 37 tests, 57 assertions, 0 failures.

| Test Class                      | Tests | Coverage                                      |
|---------------------------------|-------|-----------------------------------------------|
| AuthServiceTest                 | 7     | Registration and login validation             |
| BookServiceTest                 | 8     | Book creation, update, and deletion rules     |
| BorrowingServiceTest            | 6     | Return and borrow validation                  |
| UserServiceTest                 | 8     | Password change and subscription renewal      |
| SubscriptionStatusStrategyTest  | 8     | Strategy pattern — status calculation logic   |

---

## Project Structure

MyBookSpace/
├── backend/
│   ├── dao/                  # Database access layer
│   ├── services/
│   │   ├── strategies/       # Strategy pattern — subscription status
│   │   └── *.php             # Business logic layer
│   ├── routes/               # FlightPHP route definitions
│   ├── middleware/           # JWT auth middleware
│   ├── data/                 # Static data (roles, etc.)
│   ├── database/             # SQL schema and seed data
│   ├── tests/                # PHPUnit test classes
│   └── public/v1/docs/       # Swagger UI
├── frontend/
│   ├── pages/                # HTML page fragments (SPA)
│   ├── js/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── views/
│   ├── utils/                # REST client, constants, helpers
│   └── assets/               # CSS, JS vendors, images
├── screenshots/              # Application screenshots
├── vendor/                   # Composer dependencies (not committed)
├── composer.json
└── README.md

---

## Architectural & Design Patterns

**Architectural patterns:**
- **MVC (Frontend)** — Models handle API calls, Views handle DOM rendering, Controllers handle user interaction
- **Three-Tier Layered Architecture (Backend)** — Routes → Services → DAOs

**Design patterns:**
- **Singleton** — `Database.php` ensures a single PDO connection instance throughout the application lifecycle
- **Strategy** — `backend/services/strategies/` encapsulates subscription status calculation, making the logic easy to modify or extend independently of the service layer

---

## Default Credentials

Register a new user through the UI. A librarian account must be created directly in the database or by an existing librarian via the Manage Librarians page.