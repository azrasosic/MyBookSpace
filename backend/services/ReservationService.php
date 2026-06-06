<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/ReservationDao.php';
require_once __DIR__ . '/../dao/BookDao.php';
require_once __DIR__ . '/../dao/UserDao.php';
require_once __DIR__ . '/../dao/BorrowingDao.php';

class ReservationService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new ReservationDao());
    }

    public function getUserReservations(int $userId): array
    {
        return $this->dao->getReservationsByUser($userId);
    }

    public function getAllReservations(): array
    {
        return $this->dao->getAllReservations();
    }

    public function createReservation(int $userId, int $bookId): int|string
    {
        $bookDao = new BookDao();
        $book = $bookDao->getById($bookId);
        if (!$book) {
            throw new Exception('Book not found');
        }

        if ($book['status'] !== 'Borrowed') {
            throw new Exception('You can only reserve books that are currently borrowed');
        }

        $userDao = new UserDao();
        $user = $userDao->getById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
        $expDate = $user['subscription_expiration_date'] ?? null;
        $isExpired = !$expDate || (new DateTime($expDate) <= new DateTime('today'));
        if ($isExpired) {
            throw new Exception('Your subscription has expired. Please visit the library to renew your membership before reserving books.');
        }

        $borrowingDao = new BorrowingDao();
        $activeBorrowings = $borrowingDao->getUserActiveBorrowings($userId);
        foreach ($activeBorrowings as $borrowing) {
            if ((int) $borrowing['book_id'] === $bookId) {
                throw new Exception('You cannot reserve a book you are currently borrowing');
            }
        }

        $existing = $this->dao->getUserReservationForBook($userId, $bookId);
        if ($existing) {
            throw new Exception('You already have an active reservation for this book');
        }

        return $this->dao->createReservation($userId, $bookId);
    }

    public function cancelReservation(int $reservationId, int $userId): void
    {
        $reservation = $this->dao->getById($reservationId);
        if (!$reservation) {
            throw new Exception('Reservation not found');
        }
        if ((int) $reservation['user_id'] !== $userId) {
            throw new Exception('You can only cancel your own reservations');
        }
        $this->dao->updateStatus($reservationId, 'Cancelled');
    }

    public function updateReservationStatus(int $reservationId, string $status): void
    {
        $allowed = ['Pending', 'Available for Pickup', 'Collected', 'Cancelled'];
        if (!in_array($status, $allowed, true)) {
            throw new InvalidArgumentException('Invalid reservation status');
        }
        $reservation = $this->dao->getById($reservationId);
        if (!$reservation) {
            throw new Exception('Reservation not found');
        }
        $this->dao->updateStatus($reservationId, $status);
    }

    /**
     * Called automatically when a book is returned.
     * Promotes the oldest pending reservation to 'Available for Pickup'.
     */
    public function notifyOnReturn(int $bookId): void
    {
        $this->dao->markAvailableForPickup($bookId);
    }
}