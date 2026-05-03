<?php

declare(strict_types=1);

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL ^ (E_NOTICE | E_DEPRECATED));

class Config
{
    public static function DB_NAME()
    {
        return 'library_management';
    }

    public static function DB_PORT()
    {
        return 3306;
    }

    public static function DB_USER()
    {
        return 'your_db_user';
    }

    public static function DB_PASSWORD()
    {
        return 'your_db_password';
    }

    public static function DB_HOST()
    {
        return 'localhost';
    }

    public static function JWT_SECRET()
    {
        return 'your_random_secret_string';
    }
}