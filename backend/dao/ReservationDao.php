<?php

declare(strict_types=1);

require_once 'BaseDao.php';

class ReservationDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('reservation');
    }

    public function getReservationsByUser(int $userId): array
    {
        $query = 'SELECT r.*, b.title, b.image_url, b.genre,
                         a.name AS author_name
                  FROM reservation r
                  JOIN book b ON r.book_id = b.id
                  JOIN author a ON b.author_id = a.id
                  WHERE r.user_id = :user_id
                    AND r.status IN (\'Pending\',\'Available for Pickup\')
                  ORDER BY r.created_at DESC';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function getAllReservations(): array
    {
        $query = 'SELECT r.*,
                         b.title,
                         CONCAT(u.name,\' \',u.surname) AS user_name
                  FROM reservation r
                  JOIN book b ON r.book_id = b.id
                  JOIN user u ON r.user_id = u.id
                  ORDER BY r.created_at DESC';
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getActiveReservationByBook(int $bookId): mixed
    {
        $query = 'SELECT * FROM reservation
                  WHERE book_id = :book_id
                    AND status IN (\'Pending\',\'Available for Pickup\')
                  ORDER BY created_at ASC
                  LIMIT 1';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['book_id' => $bookId]);
        return $stmt->fetch();
    }

    public function getUserReservationForBook(int $userId, int $bookId): mixed
    {
        $query = 'SELECT * FROM reservation
                  WHERE user_id = :user_id AND book_id = :book_id
                    AND status IN (\'Pending\',\'Available for Pickup\')';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId, 'book_id' => $bookId]);
        return $stmt->fetch();
    }

    public function createReservation(int $userId, int $bookId): int|string|false
    {
        return $this->insert([
            'user_id' => $userId,
            'book_id' => $bookId,
            'status'  => 'Pending',
        ]);
    }

    public function updateStatus(int $reservationId, string $status): bool
    {
        return $this->update($reservationId, ['status' => $status]);
    }

    public function markAvailableForPickup(int $bookId): bool
    {
        $query = 'UPDATE reservation SET status = \'Available for Pickup\'
                  WHERE book_id = :book_id AND status = \'Pending\'
                  ORDER BY created_at ASC
                  LIMIT 1';
        $stmt = $this->connection->prepare($query);
        return $stmt->execute(['book_id' => $bookId]);
    }
}