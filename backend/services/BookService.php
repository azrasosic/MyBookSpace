<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/BookDao.php';

class BookService extends BaseService
{
    public function __construct()
    {
        $dao = new BookDao();
        parent::__construct($dao);
    }

    public function getBooksByGenre($genre)
    {
        return $this->dao->getBooksByGenre($genre);
    }

    public function updateStatus($bookId, $status)
    {
        return $this->dao->updateStatus($bookId, $status);
    }

    public function createBook($bookData)
    {
        if (empty($bookData['title'])) {
            throw new InvalidArgumentException("Book title is required");
        }

        if (empty($bookData['author_id'])) {
            throw new InvalidArgumentException("Author ID is required");
        }

        if (empty($bookData['genre'])) {
            throw new InvalidArgumentException("Genre is required");
        }

        if (isset($bookData['publication_year'])) {
            $currentYear = date('Y');
            if ($bookData['publication_year'] > $currentYear) {
                throw new InvalidArgumentException("Publication year cannot be in the future");
            }
        }

        $bookData['status'] = $bookData['status'] ?? 'Available';

        return $this->create($bookData);
    }

    public function updateBook($bookId, $bookData)
    {
        $book = $this->getById($bookId);
        if (!$book) {
            throw new Exception("Book not found");
        }

        if (isset($bookData['publication_year'])) {
            $currentYear = date('Y');
            if ($bookData['publication_year'] > $currentYear) {
                throw new InvalidArgumentException("Publication year cannot be in the future");
            }
        }

        return $this->update($bookId, $bookData);
    }

    public function deleteBook($bookId)
    {
        $book = $this->getById($bookId);
        if (!$book) {
            throw new Exception("Book not found");
        }

        if ($book['status'] === 'Borrowed') {
            throw new Exception("Cannot delete a book that is currently borrowed");
        }

        return $this->delete($bookId);
    }

    public function getBookWithDetails($id)
    {
        $book = $this->dao->getBookWithDetails($id);

        if (!$book) {
            return null;
        }

        return [
            'id' => (int)$book['id'],
            'title' => $book['title'],
            'author_name' => $book['author_name'],
            'biography' => $book['author_biography'],
            'ISBN' => $book['ISBN'],
            'publication_year' => $book['publication_year'] ? (int)$book['publication_year'] : null,
            'genre' => $book['genre'],
            'summary' => $book['summary'],
            'status' => $book['status'],
            'image_url' => $book['image_url'] ?? null
        ];
    }
}