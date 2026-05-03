<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/BorrowingDao.php';
require_once __DIR__ . '/BookService.php';
require_once __DIR__ . '/UserService.php';

class BorrowingService extends BaseService
{
    public function __construct()
    {
        $dao = new BorrowingDao();
        parent::__construct($dao);
    }

    public function returnBook($borrowingId, $returnDate)
    {
        if (empty($returnDate)) {
            throw new InvalidArgumentException("Return date is required");
        }

        $borrowing = $this->getById($borrowingId);
        if (!$borrowing) {
            throw new Exception("Borrowing record not found");
        }

        if ($borrowing['status'] === 'Returned') {
            throw new Exception("Book has already been returned");
        }

        if ($returnDate < $borrowing['borrow_date']) {
            throw new InvalidArgumentException("Return date cannot be before borrow date");
        }

        return $this->dao->returnBook($borrowingId, $returnDate);
    }

    public function getUserActiveBorrowings($userId)
    {
        if (empty($userId)) {
            throw new InvalidArgumentException("User ID is required");
        }
        return $this->dao->getUserActiveBorrowings($userId);
    }

    public function borrowBook($bookId, $userId, $librarianId)
    {
        if (empty($bookId) || empty($userId) || empty($librarianId)) {
            throw new InvalidArgumentException("Book ID, User ID, and Librarian ID are required");
        }

        $bookService = new BookService();
        $userService = new UserService();

        $book = $bookService->getById($bookId);
        if (!$book) {
            throw new Exception("Book not found");
        }

        if ($book['status'] !== 'Available') {
            throw new Exception("Book is not available for borrowing");
        }

        $user = $userService->getById($userId);
        if (!$user) {
            throw new Exception("User not found");
        }

        $activeBorrowings = $this->getUserActiveBorrowings($userId);
        if (count($activeBorrowings) > 0) {
            throw new Exception("User cannot borrow new books while having an active borrowing");
        }

        $borrowingData = [
            'book_id' => $bookId,
            'user_id' => $userId,
            'librarian_id' => $librarianId,
            'borrow_date' => date('Y-m-d'),
            'due_date' => date('Y-m-d', strtotime('+14 days')),
            'status' => 'Active'
        ];

        $bookService->updateStatus($bookId, 'Borrowed');

        return $this->create($borrowingData);
    }
}