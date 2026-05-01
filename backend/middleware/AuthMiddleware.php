<?php

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    public function verifyToken($token)
    {
        if (str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
        }
        if (!$token) {
            throw new Exception("Missing authentication token");
        }

        try {
            $decodedToken = JWT::decode($token, new Key(Config::JWT_SECRET(), 'HS256'));
            if (!isset($decodedToken->user)) {
                throw new Exception("Invalid token structure");
            }

            Flight::set('user', $decodedToken->user);
            Flight::set('jwt_token', $token);
            return true;
        } catch (\Exception $e) {
            throw new Exception("Token verification failed: " . $e->getMessage());
        }
    }

    public function authorizeRole($requiredRole)
    {
        $user = Flight::get('user');

        if ($user === null) {
            error_log("User is null in authorizeRole");
            Flight::halt(401, 'User not authenticated');
        }

        if (!isset($user->role)) {
            error_log("User object exists but no role: " . print_r($user, true));
            Flight::halt(500, 'User role not set in token');
        }

        if ($user->role !== $requiredRole) {
            Flight::halt(403, 'Access denied: insufficient privileges');
        }
    }

    public function authorizeRoles(array $roles)
    {
        $user = Flight::get('user');
        if ($user === null) {
            error_log("User is null in authorizeRoles");
            Flight::halt(401, 'User not authenticated');
        }
        if (!isset($user->role)) {
            error_log("User object: " . print_r($user, true));
            Flight::halt(500, 'User role not set in token');
        }

        if (!in_array($user->role, $roles)) {
            Flight::halt(403, 'Forbidden: role not allowed');
        }
    }

    public function authorizePermission($permission)
    {
        $user = Flight::get('user');
        if (!in_array($permission, $user->permissions)) {
            Flight::halt(403, 'Access denied: permission missing');
        }
    }
}