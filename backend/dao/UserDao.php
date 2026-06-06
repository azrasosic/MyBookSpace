<?php

declare(strict_types=1);

require_once 'BaseDao.php';

class UserDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('user');
    }

    public function getUserByEmail($email)
    {
        $query = 'SELECT * FROM user WHERE email = :email';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['email' => $email]);
        return $stmt->fetch();
    }

    public function registerUser($userData)
    {
        if (empty($userData['email']) || empty($userData['password'])) {
            throw new InvalidArgumentException('Email and password are required');
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
        $query = 'SELECT b.*, br.borrow_date, br.due_date, br.return_date, br.status as borrowing_status,
                         a.name as author_name
                  FROM borrowing br
                  JOIN book b ON br.book_id = b.id
                  JOIN author a ON b.author_id = a.id
                  WHERE br.user_id = :user_id
                  ORDER BY br.borrow_date DESC';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function getById($id)
    {
        $query = 'SELECT id, name, surname, email, phone, date_of_birth, date_joined, role,
                         subscription_status, subscription_expiration_date, renewed_by
                  FROM user WHERE id = :id';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function getUserByIdWithPassword($id)
    {
        $query = 'SELECT * FROM user WHERE id = :id';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    public function getAll()
    {
        $query = 'SELECT id, name, surname, email, phone, date_of_birth, date_joined, role,
                         subscription_status, subscription_expiration_date, renewed_by
                  FROM user ORDER BY name, surname';
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function renewSubscription(int $userId, string $newExpirationDate, int $librarianId): bool
    {
        return $this->update($userId, [
            'subscription_expiration_date' => $newExpirationDate,
            'subscription_status'          => 'Active',
            'renewed_by'                   => $librarianId,
        ]);
    }

    public function getUsersExpiringSoon(int $days = 7): array
    {
        $query = 'SELECT id, name, surname, email, phone,
                         subscription_status, subscription_expiration_date
                  FROM user
                  WHERE subscription_expiration_date IS NOT NULL
                    AND subscription_expiration_date >= CURDATE()
                    AND subscription_expiration_date <= DATE_ADD(CURDATE(), INTERVAL :days DAY)
                  ORDER BY subscription_expiration_date ASC';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['days' => $days]);
        return $stmt->fetchAll();
    }

    public function getExpiredUsers(): array
    {
        $query = 'SELECT id, name, surname, email, phone,
                         subscription_status, subscription_expiration_date
                  FROM user
                  WHERE subscription_expiration_date IS NULL
                     OR subscription_expiration_date < CURDATE()
                  ORDER BY subscription_expiration_date ASC';
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}