<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/AuthorDao.php';

class AuthorService extends BaseService
{
    public function __construct()
    {
        $dao = new AuthorDao();
        parent::__construct($dao);
    }

    public function getBooksByAuthor($authorId)
    {
        return $this->dao->getBooksByAuthor($authorId);
    }

    public function createAuthor($data)
    {
        if (empty($data['name'])) {
            throw new Exception('Author name is required.');
        }

        if (strlen($data['name']) < 2) {
            throw new Exception('Author name must be at least 2 characters long.');
        }

        return $this->create($data);
    }

    public function updateAuthor($id, $data)
    {
        if (empty($data['name'])) {
            throw new Exception('Author name cannot be empty.');
        }

        return $this->update($id, $data);
    }

    public function deleteAuthor($id)
    {
        if ($this->dao->hasBooks($id)) {
            throw new Exception("Cannot delete an author with existing books");
        }
        return $this->delete($id);
    }
}