<?php

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/UserDao.php';

class UserService extends BaseService
{
    public function __construct()
    {
        parent::__construct(new UserDao());
    }

    public function registerUser($userData)
    {
        if (empty($userData['email']) || empty($userData['password'])) {
            throw new InvalidArgumentException("Email and password are required");
        }

        if (!filter_var($userData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format");
        }

        if ($this->dao->getUserByEmail($userData['email'])) {
            throw new Exception("Email already registered");
        }

        if (strlen($userData['password']) < 8) {
            throw new InvalidArgumentException("Password must be at least 8 characters");
        }

        if (isset($userData['password'])) {
            $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        }

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
            throw new Exception("User not found");
        }

        if (!password_verify($password, $user['password'])) {
            throw new Exception("Invalid password");
        }

        unset($user['password']);
        return $user;
    }

    public function updateProfile($userId, $profileData)
    {
        $user = $this->getById($userId);
        if (!$user) {
            throw new Exception("User not found");
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
            throw new Exception("User not found");
        }

        if (!password_verify($currentPassword, $user['password'])) {
            throw new Exception("Current password is incorrect");
        }

        if (strlen($newPassword) < 8) {
            throw new InvalidArgumentException("New password must be at least 8 characters");
        }

        $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        return $this->dao->update($userId, [
            'password' => $hashedNewPassword
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
                throw new Exception("Librarian not found");
            }

            unset($librarian['password']);
            $librarian['role'] = 'librarian';
            return $librarian;
        }

        $user = $this->getById($userId);

        if (!$user) {
            throw new Exception("User not found");
        }

        unset($user['password']);
        $user['role'] = 'user';
        return $user;
    }
}