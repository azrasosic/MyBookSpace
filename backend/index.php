<?php

declare(strict_types=1);

/**
 * Application Entry Point
 * 
 * Initializes the Flight PHP framework, registers services, sets up middleware,
 * and loads all route definitions for the Library Management API.
 * 
 * @package App
 */

require_once '../vendor/autoload.php';
require_once 'dao/config.php';

require_once 'dao/BaseDao.php';
require_once 'services/BaseService.php';

require_once 'services/AuthService.php';
require_once 'services/LibrarianService.php';
require_once 'services/AuthorService.php';
require_once 'services/BookService.php';
require_once 'services/UserService.php';
require_once 'services/BorrowingService.php';
require_once 'middleware/AuthMiddleware.php';
require_once 'data/roles.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


Flight::register('auth_middleware', 'AuthMiddleware');
Flight::register('authservice', 'AuthService');
Flight::register('librarianService', 'LibrarianService');
Flight::register('authorService', 'AuthorService');
Flight::register('bookService', 'BookService');
Flight::register('userService', 'UserService');
Flight::register('borrowingService', 'BorrowingService');


Flight::before('start', function (&$params, &$output) {
    $url = Flight::request()->url;

    error_log("=== MIDDLEWARE START ===");
    error_log("Request URL: " . $url);

    $publicRoutes = [
        '/auth/register',
        '/auth/login',
        '/librarians/login'
    ];

    foreach ($publicRoutes as $route) {
        if (strpos($url, $route) === 0) {
            error_log("Public route detected, skipping auth");
            return;
        }
    }

    try {
        $token = Flight::request()->getHeader("Authentication");
        error_log("Token from header: " . ($token ? "EXISTS" : "NULL"));

        if (!$token) {
            error_log("No token found, halting with 401");
            Flight::json(['error' => 'Missing authentication token'], 401);
            Flight::stop();
            return false;
        }

        Flight::auth_middleware()->verifyToken($token);

        $user = Flight::get('user');
        error_log("User after verifyToken: " . ($user ? json_encode($user) : "NULL"));

        if (!$user) {
            error_log("User is null after token verification!");
            Flight::json(['error' => 'Token verification failed'], 401);
            Flight::stop();
            return false;
        }

        error_log("=== MIDDLEWARE END - AUTH SUCCESS ===");
    } catch (\Exception $e) {
        error_log("Middleware exception: " . $e->getMessage());
        Flight::json(['error' => 'Authentication failed: ' . $e->getMessage()], 401);
        Flight::stop();
        return false;
    }
});


require_once 'routes/AuthRoutes.php';
require_once 'routes/LibrarianRoutes.php';
require_once 'routes/AuthorRoutes.php';
require_once 'routes/BookRoutes.php';
require_once 'routes/UserRoutes.php';
require_once 'routes/BorrowingRoutes.php';


Flight::start();