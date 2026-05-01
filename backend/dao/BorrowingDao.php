<?php

declare(strict_types=1);

require_once 'BaseDao.php';
require_once 'BookDao.php';

class BorrowingDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('borrowing');
    }

    public function returnBook($borrowingId, $returnDate)
    {
        try {
            $this->update($borrowingId, [
                'return_date' => $returnDate,
                'status' => 'Returned'
            ]);

            $borrowing = $this->getById($borrowingId);
            if (!$borrowing) {
                throw new Exception("Borrowing record with ID $borrowingId not found");
            }

            $bookId = $borrowing['book_id'];

            $bookDao = new BookDao();
            $bookDao->updateStatus($bookId, 'Available');

            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getUserActiveBorrowings($userId)
    {
        $query = "SELECT br.*, b.title as book_title, a.name as author_name
                  FROM borrowing br
                  JOIN book b ON br.book_id = b.id
                  JOIN author a ON b.author_id = a.id
                  WHERE br.user_id = :user_id AND br.status = 'Active'
                  ORDER BY br.due_date";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }
}