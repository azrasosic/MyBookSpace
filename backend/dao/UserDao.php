<?php

require_once 'BaseDao.php';

class UserDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('user');
    }

    public function getUserByEmail($email)
    {
        $query = "SELECT * FROM user WHERE email = :email";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    public function registerUser($userData)
    {
        if (empty($userData['email']) || empty($userData['password'])) {
            throw new InvalidArgumentException("Email and password are required");
        }
        return $this->insert($userData);
    }

    public function updateProfile($userId, $profileData)
    {
        $allowed = ['name', 'surname', 'email', 'phone', 'date_of_birth'];
        $filteredData = array_intersect_key($profileData, array_flip($allowed));

        if (!empty($filteredData)) {
            return $this->update($userId, $filteredData);
        }
        return false;
    }

    public function getUserBorrowingHistory($userId)
    {
        $query = "SELECT b.*, br.borrow_date, br.due_date, br.return_date, br.status as borrowing_status
                  FROM borrowing br
                  JOIN book b ON br.book_id = b.id
                  WHERE br.user_id = :user_id
                  ORDER BY br.borrow_date DESC";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function getById($id)
    {
        $query = "SELECT id, name, surname, email, phone, date_of_birth, date_joined, role FROM user WHERE id = :id";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function getUserByIdWithPassword($id)
    {
        $query = "SELECT * FROM user WHERE id = :id";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }
}