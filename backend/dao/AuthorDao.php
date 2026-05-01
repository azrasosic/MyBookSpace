<?php

declare(strict_types=1);

require_once 'BaseDao.php';

class AuthorDao extends BaseDao
{
    public function __construct()
    {
        parent::__construct('author');
    }

    /**
     * @param int $authorId
     * @return array
     */
    public function getBooksByAuthor($authorId)
    {
        $query = "SELECT b.*, a.name as author_name 
                  FROM book b 
                  JOIN author a ON b.author_id = a.id 
                  WHERE b.author_id = :author_id 
                  ORDER BY b.publication_year DESC, b.title";
        $stmt = $this->connection->prepare($query);
        $stmt->execute(['author_id' => $authorId]);
        return $stmt->fetchAll();
    }

    public function getAll()
    {
        $stmt = $this->connection->prepare(
            "SELECT a.*, COUNT(b.id) as book_count 
            FROM author a 
            LEFT JOIN book b ON b.author_id = a.id 
            GROUP BY a.id"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function hasBooks($authorId)
    {
        $stmt = $this->connection->prepare(
            "SELECT COUNT(*) FROM book WHERE author_id = :author_id"
        );
        $stmt->execute(['author_id' => $authorId]);
        return $stmt->fetchColumn() > 0;
    }
}