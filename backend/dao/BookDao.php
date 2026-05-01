<?php

declare(strict_types=1);

require_once 'BaseDao.php';

class BookDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('book');
    }

    public function getBookWithDetails($id)
    {
        $query = "SELECT b.*, a.name as author_name, a.biography as author_biography
                  FROM book b
                  LEFT JOIN author a ON b.author_id = a.id
                  WHERE b.id = :id";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getBooksByGenre($genre)
    {
        $query = "SELECT b.*, a.name as author_name
                  FROM book b
                  JOIN author a ON b.author_id = a.id
                  WHERE b.genre = :genre
                  ORDER BY b.title";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['genre' => $genre]);
        return $stmt->fetchAll();
    }

    public function updateStatus($bookId, $status)
    {
        return $this->update($bookId, ['status' => $status]);
    }
}