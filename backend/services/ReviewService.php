<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/ReviewDao.php';

class ReviewService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new ReviewDao());
    }

    public function getReviewsForBook(int $bookId): array
    {
        $reviews = $this->dao->getReviewsByBook($bookId);
        $avgRating = $this->dao->getAverageRating($bookId);
        return [
            'reviews'       => $reviews,
            'average_rating' => $avgRating,
            'count'         => count($reviews),
        ];
    }

    public function getAllReviews(): array
    {
        return $this->dao->getAllReviews();
    }

    public function getUserReviewForBook(int $userId, int $bookId): mixed
    {
        return $this->dao->getReviewByUserAndBook($userId, $bookId);
    }

    public function canUserReview(int $userId, int $bookId): bool
    {
        return $this->dao->hasCompletedBorrowing($userId, $bookId);
    }

    public function submitReview(int $userId, int $bookId, int $rating, ?string $comment): array
    {
        if ($rating < 1 || $rating > 5) {
            throw new InvalidArgumentException('Rating must be between 1 and 5');
        }

        if ($comment && mb_strlen($comment) > 500) {
            throw new InvalidArgumentException('Review comment cannot exceed 500 characters');
        }

        if (!$this->dao->hasCompletedBorrowing($userId, $bookId)) {
            throw new Exception('You can only review books you have borrowed and returned');
        }

        $existing = $this->dao->getReviewByUserAndBook($userId, $bookId);

        if ($existing) {
            $this->dao->updateReview((int) $existing['id'], $rating, $comment);
            return ['action' => 'updated', 'review_id' => (int) $existing['id']];
        }

        $reviewId = $this->dao->createReview($userId, $bookId, $rating, $comment);
        return ['action' => 'created', 'review_id' => (int) $reviewId];
    }

    public function deleteReview(int $reviewId): void
    {
        $review = $this->dao->getById($reviewId);
        if (!$review) {
            throw new Exception('Review not found');
        }
        $this->dao->delete($reviewId);
    }
}