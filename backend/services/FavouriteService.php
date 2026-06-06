<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/FavouriteDao.php';

class FavouriteService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new FavouriteDao());
    }

    public function getUserFavourites(int $userId): array
    {
        return $this->dao->getFavouritesByUser($userId);
    }

    public function isFavourite(int $userId, int $bookId): bool
    {
        return (bool) $this->dao->getFavouriteByUserAndBook($userId, $bookId);
    }

    public function toggleFavourite(int $userId, int $bookId): array
    {
        $existing = $this->dao->getFavouriteByUserAndBook($userId, $bookId);
        if ($existing) {
            $this->dao->removeFavourite($userId, $bookId);
            return ['action' => 'removed', 'is_favourite' => false];
        }
        $this->dao->addFavourite($userId, $bookId);
        return ['action' => 'added', 'is_favourite' => true];
    }

    public function addFavourite(int $userId, int $bookId): void
    {
        if ($this->isFavourite($userId, $bookId)) {
            throw new Exception('Book is already in favourites');
        }
        $this->dao->addFavourite($userId, $bookId);
    }

    public function removeFavourite(int $userId, int $bookId): void
    {
        if (!$this->isFavourite($userId, $bookId)) {
            throw new Exception('Book is not in favourites');
        }
        $this->dao->removeFavourite($userId, $bookId);
    }
}