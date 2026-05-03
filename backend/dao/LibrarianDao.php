<?php

declare(strict_types=1);

require_once 'BaseDao.php';

class LibrarianDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('librarian');
    }

    public function getLibrarianByEmail($email)
    {
        $query = "SELECT * FROM librarian WHERE email = :email";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    public function updateProfile($librarianId, $profileData)
    {
        $allowed = ['name', 'surname', 'email', 'phone', 'date_of_birth'];
        $filteredData = array_intersect_key($profileData, array_flip($allowed));

        if (!empty($filteredData)) {
            return $this->update($librarianId, $filteredData);
        }
        return false;
    }

    public function getById($id)
    {
        $query = "SELECT id, name, surname, email, phone, date_of_birth, employment_date, role FROM librarian WHERE id = :id";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function getLibrarianByIdWithPassword($id)
    {
        $query = "SELECT * FROM librarian WHERE id = :id";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }
}