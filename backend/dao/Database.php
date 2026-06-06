<?php

declare(strict_types=1);

require_once 'config.php';

class Database
{
    private static $connection = null;

    public static function connect()
    {
        if (self::$connection === null) {
            try {
                self::$connection = new PDO(
                    'mysql:host=' . Config::DB_HOST() .
                    ';dbname=' . Config::DB_NAME() .
                    ';port=' . Config::DB_PORT() .
                    ';charset=utf8mb4',
                    Config::DB_USER(),
                    Config::DB_PASSWORD(),
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]
                );
                self::$connection->exec('SET NAMES utf8mb4');
            } catch (PDOException $e) {
                die('Connection failed: ' . $e->getMessage());
            }
        }
        return self::$connection;
    }
}