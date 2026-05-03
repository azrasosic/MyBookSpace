<?php

declare(strict_types=1);

require_once __DIR__ . '/BaseService.php';
require_once __DIR__ . '/../dao/LibrarianDao.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class LibrarianService extends BaseService
{
    public function __construct()
    {
        $dao = new LibrarianDao();
        parent::__construct($dao);
    }

    public function getLibrarianByEmail($email)
    {
        return $this->dao->getLibrarianByEmail($email);
    }

    public function login($data)
    {
        if (empty($data['email']) || empty($data['password'])) {
            return ['success' => false, 'error' => 'Email and password are required.'];
        }

        $librarian = $this->getLibrarianByEmail($data['email']);
        if (!$librarian) {
            return ['success' => false, 'error' => 'Invalid email or password.'];
        }

        if (!password_verify($data['password'], $librarian['password'])) {
            return ['success' => false, 'error' => 'Invalid email or password.'];
        }

        unset($librarian['password']);

        $jwtPayload = [
            'user' => $librarian,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24)
        ];

        $token = JWT::encode(
            $jwtPayload,
            Config::JWT_SECRET(),
            'HS256'
        );

        return ['success' => true, 'data' => array_merge($librarian, ['token' => $token])];
    }

    public function changePassword($librarianId, $currentPassword, $newPassword)
    {
        $librarian = $this->dao->getLibrarianByIdWithPassword($librarianId);
        if (!$librarian) {
            throw new Exception("Librarian not found");
        }

        if (!password_verify($currentPassword, $librarian['password'])) {
            throw new Exception("Current password is incorrect");
        }

        if (strlen($newPassword) < 8) {
            throw new InvalidArgumentException("New password must be at least 8 characters");
        }

        $hashedNewPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        return $this->dao->update($librarianId, [
            'password' => $hashedNewPassword
        ]);
    }

    public function updateProfile($librarianId, $profileData)
    {
        $librarian = $this->getById($librarianId);
        if (!$librarian) {
            throw new Exception("Librarian not found");
        }

        $allowed = ['name', 'surname', 'email', 'phone', 'date_of_birth'];
        $filteredData = array_intersect_key($profileData, array_flip($allowed));

        if (empty($filteredData)) {
            return false;
        }

        return $this->dao->updateProfile($librarianId, $filteredData);
    }

    public function createLibrarian($librarianData)
    {
        if (empty($librarianData['name'])) {
            throw new InvalidArgumentException("Name is required");
        }

        if (empty($librarianData['surname'])) {
            throw new InvalidArgumentException("Surname is required");
        }

        if (empty($librarianData['email'])) {
            throw new InvalidArgumentException("Email is required");
        }

        if (empty($librarianData['password'])) {
            throw new InvalidArgumentException("Password is required");
        }

        if (empty($librarianData['employment_date'])) {
            throw new InvalidArgumentException("Employment date is required");
        }

        if (!filter_var($librarianData['email'], FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email format");
        }

        if ($this->dao->getLibrarianByEmail($librarianData['email'])) {
            throw new Exception("Email already registered");
        }

        if (strlen($librarianData['password']) < 8) {
            throw new InvalidArgumentException("Password must be at least 8 characters");
        }

        if (isset($librarianData['date_of_birth'])) {
            $dateOfBirth = DateTime::createFromFormat('Y-m-d', $librarianData['date_of_birth']);
            if (!$dateOfBirth || $dateOfBirth->format('Y-m-d') !== $librarianData['date_of_birth']) {
                throw new InvalidArgumentException("Invalid date of birth format. Use YYYY-MM-DD");
            }
        }

        $employmentDate = DateTime::createFromFormat('Y-m-d', $librarianData['employment_date']);
        if (!$employmentDate || $employmentDate->format('Y-m-d') !== $librarianData['employment_date']) {
            throw new InvalidArgumentException("Invalid employment date format. Use YYYY-MM-DD");
        }

        if (isset($librarianData['password'])) {
            $librarianData['password'] = password_hash($librarianData['password'], PASSWORD_DEFAULT);
        }

        $librarianData['role'] = 'librarian';

        return $this->dao->insert($librarianData);
    }
}