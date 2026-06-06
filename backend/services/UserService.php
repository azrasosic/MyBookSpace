<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';
require_once __DIR__ . '/../dao/LibrarianDao.php';
require_once __DIR__ . '/strategies/SubscriptionStatusStrategy.php';
require_once __DIR__ . '/strategies/StandardSubscriptionStrategy.php';

class UserService extends BaseService
{
    /** @var SubscriptionStatusStrategy */
    private SubscriptionStatusStrategy $subscriptionStrategy;

    public function __construct(?SubscriptionStatusStrategy $strategy = null)
    {
        parent::__construct(new UserDao());
        $this->subscriptionStrategy = $strategy ?? new StandardSubscriptionStrategy(7);
    }

    public function setSubscriptionStrategy(SubscriptionStatusStrategy $strategy): void
    {
        $this->subscriptionStrategy = $strategy;
    }

    /**
     * Calculate subscription status using the injected strategy.
     * This is the single place business rules are applied.
     */
    public function calculateSubscriptionStatus(?string $expirationDate): string
    {
        return $this->subscriptionStrategy->calculate($expirationDate);
    }

    public function registerUser($userData)
    {
        if (empty($userData['email']) || empty($userData['password'])) {
            throw new InvalidArgumentException('Email and password are required');
        }
        if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Invalid email format');
        }
        if ($this->dao->getUserByEmail($userData['email'])) {
            throw new Exception('Email already registered');
        }
        if (strlen($userData['password']) < 8) {
            throw new InvalidArgumentException('Password must be at least 8 characters');
        }
        $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        return $this->dao->registerUser($userData);
    }

    public function getUserByEmail($email)
    {
        return $this->dao->getUserByEmail($email);
    }

    public function login($email, $password)
    {
        $user = $this->getUserByEmail($email);
        if (!$user) {
            throw new Exception('User not found');
        }
        if (!password_verify($password, $user['password'])) {
            throw new Exception('Invalid password');
        }
        unset($user['password']);

        $user['subscription_status'] = $this->calculateSubscriptionStatus(
            $user['subscription_expiration_date'] ?? null
        );
        return $user;
    }

    public function updateProfile($userId, $profileData)
    {
        $user = $this->getById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
        $allowed = ['name', 'surname', 'email', 'phone', 'date_of_birth'];
        $filteredData = array_intersect_key($profileData, array_flip($allowed));
        if (empty($filteredData)) {
            return false;
        }
        return $this->dao->updateProfile($userId, $filteredData);
    }

    public function changePassword($userId, $currentPassword, $newPassword)
    {
        $user = $this->dao->getUserByIdWithPassword($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
        if (!password_verify($currentPassword, $user['password'])) {
            throw new Exception('Current password is incorrect');
        }
        if (strlen($newPassword) < 8) {
            throw new InvalidArgumentException('New password must be at least 8 characters');
        }
        return $this->dao->update($userId, [
            'password' => password_hash($newPassword, PASSWORD_DEFAULT)
        ]);
    }

    public function getUserBorrowingHistory($userId)
    {
        return $this->dao->getUserBorrowingHistory($userId);
    }

    public function getFullProfile($userId, $userRole = null)
    {
        if ($userRole === 'librarian') {
            $librarianDao = new LibrarianDao();
            $librarian = $librarianDao->getById($userId);
            if (!$librarian) {
                throw new Exception('Librarian not found');
            }
            unset($librarian['password']);
            $librarian['role'] = 'librarian';
            return $librarian;
        }

        $user = $this->getById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
        unset($user['password']);
        $user['role'] = 'user';

        $user['subscription_status'] = $this->calculateSubscriptionStatus(
            $user['subscription_expiration_date'] ?? null
        );
        return $user;
    }

    public function getAllUsersWithSubscription(): array
    {
        $users = $this->dao->getAll();
        foreach ($users as &$user) {
            $user['subscription_status'] = $this->calculateSubscriptionStatus(
                $user['subscription_expiration_date'] ?? null
            );
        }
        return $users;
    }

    public function getUsersExpiringSoon(int $days = 7): array
    {
        return $this->dao->getUsersExpiringSoon($days);
    }

    public function getExpiredUsers(): array
    {
        return $this->dao->getExpiredUsers();
    }

    public function renewSubscription(int $userId, string $newExpirationDate, int $librarianId): void
    {
        $user = $this->dao->getById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }

        $date = DateTime::createFromFormat('Y-m-d', $newExpirationDate);
        if (!$date || $date->format('Y-m-d') !== $newExpirationDate) {
            throw new InvalidArgumentException('Invalid expiration date format. Use YYYY-MM-DD');
        }

        if ($date <= new DateTime('today')) {
            throw new InvalidArgumentException('New expiration date must be in the future');
        }

        $this->dao->renewSubscription($userId, $newExpirationDate, $librarianId);
    }

    public function getSubscriptionStatus(int $userId): array
    {
        $user = $this->dao->getById($userId);
        if (!$user) {
            throw new Exception('User not found');
        }
        $status = $this->calculateSubscriptionStatus($user['subscription_expiration_date'] ?? null);
        return [
            'status'          => $status,
            'expiration_date' => $user['subscription_expiration_date'],
        ];
    }
}