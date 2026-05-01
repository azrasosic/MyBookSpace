<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseDao.php';

class AuthDao extends BaseDao
{
    protected $tableName;

    public function __construct()
    {
        $this->tableName = "user";
        parent::__construct($this->tableName);
    }

    /**
     * Retrieves a user record from the database by email address.
     *
     * @param string $email The email address to search for.
     * @return mixed The user record if found, or false if not found.
     */
    public function getUserByEmail($email)
    {
        $query = "SELECT * FROM " . $this->tableName . " WHERE email = :email";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }
}