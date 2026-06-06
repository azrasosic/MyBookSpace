<?php

declare(strict_types=1);

require_once 'BaseDao.php';

class ReviewDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('review');
    }

    public function getReviewsByBook(int $bookId): array
    {
        $query = 'SELECT id, book_id, rating, comment, created_at
                  FROM review
                  WHERE book_id = :book_id
                  ORDER BY created_at DESC';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['book_id' => $bookId]);
        return $stmt->fetchAll();
    }

    public function getAllReviews(): array
    {
        $query = 'SELECT r.id, r.rating, r.comment, r.created_at,
                         b.title AS book_title,
                         CONCAT(u.name,\' \',u.surname) AS user_name
                  FROM review r
                  JOIN book b ON r.book_id = b.id
                  JOIN user u ON r.user_id = u.id
                  ORDER BY r.created_at DESC';
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getReviewByUserAndBook(int $userId, int $bookId): mixed
    {
        $query = 'SELECT * FROM review WHERE user_id = :user_id AND book_id = :book_id';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId, 'book_id' => $bookId]);
        return $stmt->fetch();
    }

    public function getAverageRating(int $bookId): float
    {
        $query = 'SELECT AVG(rating) AS avg_rating FROM review WHERE book_id = :book_id';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['book_id' => $bookId]);
        $result = $stmt->fetchColumn();
        return $result ? round((float) $result, 1) : 0.0;
    }

    public function hasCompletedBorrowing(int $userId, int $bookId): bool
    {
        $query = 'SELECT COUNT(*) FROM borrowing
                  WHERE user_id = :user_id AND book_id = :book_id AND status = \'Returned\'';
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId, 'book_id' => $bookId]);
        return (int) $stmt->fetchColumn() > 0;
    }

    public function createReview(int $userId, int $bookId, int $rating, ?string $comment): int|string|false
    {
        return $this->insert([
            'user_id' => $userId,
            'book_id' => $bookId,
            'rating'  => $rating,
            'comment' => $comment,
        ]);
    }

    public function updateReview(int $reviewId, int $rating, ?string $comment): bool
    {
        return $this->update($reviewId, ['rating' => $rating, 'comment' => $comment]);
    }
}