<?php

declare(strict_types=1);

require_once 'BaseService.php';
require_once __DIR__ . '/../dao/AuthDao.php';
require_once __DIR__ . '/../data/roles.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService extends BaseService
{
    private $authDao;

    public function __construct()
    {
        $this->authDao = new AuthDao();
        parent::__construct(new AuthDao());
    }

    public function getUserByEmail($email)
    {
        return $this->authDao->getUserByEmail($email);
    }

    public function registerUser($entity)
    {
        if (empty($entity['email']) || empty($entity['password'])) {
            return ['success' => false, 'error' => 'Email and password are required.'];
        }

        unset($entity['confirm_password']);

        $emailExists = $this->authDao->getUserByEmail($entity['email']);
        if ($emailExists) {
            return ['success' => false, 'error' => 'Email already registered.'];
        }

        $entity['password'] = password_hash($entity['password'], PASSWORD_BCRYPT);
        $entity['role'] = Roles::USER;
        $userId = $this->authDao->insert($entity);

        if (!$userId) {
            return ['success' => false, 'error' => 'Registration failed.'];
        }

        $newUser = $this->authDao->getById($userId);

        if (!$newUser) {
            return ['success' => false, 'error' => 'User created but could not be retrieved.'];
        }
        unset($newUser['password']);

        return ['success' => true, 'data' => $newUser];
    }

    public function login($entity)
    {
        if (empty($entity['email']) || empty($entity['password'])) {
            return ['success' => false, 'error' => 'Email and password are required.'];
        }

        $user = $this->authDao->getUserByEmail($entity['email']);
        if (!$user) {
            return ['success' => false, 'error' => 'Invalid username or password.'];
        }

        if (!$user || !password_verify($entity['password'], $user['password'])) {
            return ['success' => false, 'error' => 'Invalid username or password.'];
        }

        unset($user['password']);
        if (!isset($user['role'])) {
            error_log("WARNING: Role not found in user data!");
            $user['role'] = Roles::USER;
        }
        $jwtPayload = [
            'user' => $user,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24)
        ];

        $token = JWT::encode(
            $jwtPayload,
            Config::JWT_SECRET(),
            'HS256'
        );

        return ['success' => true, 'data' => array_merge($user, ['token' => $token])];
    }
}