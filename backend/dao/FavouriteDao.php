<?php

declare(strict_types=1);

require_once 'BaseDao.php';

class FavouriteDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('favourite');
    }

    public function getFavouritesByUser(int $userId): array
    {
        $query = 'SELECT f.id, f.user_id, f.book_id, f.created_at,
                         b.title, b.genre, b.image_url, b.status,
                         a.name AS author_name, a.id AS author_id
                  FROM favourite f
                  JOIN book b ON f.book_id = b.id
                  JOIN author a ON b.author_id = a.id
                  WHERE f.user_id = :user_id
                  ORDER BY f.created_at DESC';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function getFavouriteByUserAndBook(int $userId, int $bookId): mixed
    {
        $query = 'SELECT * FROM favourite WHERE user_id = :user_id AND book_id = :book_id';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId, 'book_id' => $bookId]);
        return $stmt->fetch();
    }

    public function addFavourite(int $userId, int $bookId): int|string|false
    {
        return $this->insert(['user_id' => $userId, 'book_id' => $bookId]);
    }

    public function removeFavourite(int $userId, int $bookId): bool
    {
        $query = 'DELETE FROM favourite WHERE user_id = :user_id AND book_id = :book_id';
        $stmt = $this->connection->prepare($query);
        return $stmt->execute(['user_id' => $userId, 'book_id' => $bookId]);
    }
}