<?php

declare(strict_types=1);

/**
 * @OA\Get(
 *     path="/users",
 *     tags={"users"},
 *     summary="Get all users",
 *     operationId="getAllUsers",
 *     @OA\Response(
 *         response=200,
 *         description="List of all users",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/User")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $users = Flight::userService()->getAll();
        $users = array_map(function ($user) {
            unset($user['password']);
            return $user;
        }, $users);
        Flight::json($users);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/users/{id}",
 *     tags={"users"},
 *     summary="Get user by ID",
 *     operationId="getUserById",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User details",
 *         @OA\JsonContent(ref="#/components/schemas/User")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="User not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/@id', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $user = Flight::userService()->getById($id);
        if ($user) {
            unset($user['password']);
            Flight::json($user);
        } else {
            Flight::json(['error' => 'User not found'], 404);
        }
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Patch(
 *     path="/users/{id}/profile",
 *     tags={"users"},
 *     summary="Update user profile (partial updates)",
 *     operationId="updateUserProfile",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1)
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         description="Fields to update (all optional)",
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", example="Jonathan"),
 *             @OA\Property(property="surname", type="string", example="Smith"),
 *             @OA\Property(property="email", type="string", format="email", example="jonathan.smith@example.com"),
 *             @OA\Property(property="phone", type="string", example="+9876543210"),
 *             @OA\Property(property="date_of_birth", type="string", format="date", example="1990-05-15")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Profile updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Profile updated successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="No valid fields provided",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="No fields to update")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="User not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PATCH /users/@id/profile', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $data = Flight::request()->data->getData();
        $updated = Flight::userService()->updateProfile($id, $data);

        if ($updated) {
            Flight::json([
                'success' => true,
                'message' => 'Profile updated successfully'
            ]);
        } else {
            Flight::json([
                'success' => false,
                'error' => 'No fields to update'
            ], 400);
        }
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], 404);
    }
});

/**
 * @OA\Put(
 *     path="/users/{id}/password",
 *     tags={"users"},
 *     summary="Change user password",
 *     operationId="changeUserPassword",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"currentPassword", "newPassword"},
 *             @OA\Property(property="currentPassword", type="string", format="password", example="oldPassword123"),
 *             @OA\Property(property="newPassword", type="string", format="password", minLength=8, example="newSecurePassword456")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Password changed successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Password changed successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Bad request",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Current password is incorrect")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="User not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PUT /users/@id/password', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::userService()->changePassword(
            $id,
            $data['currentPassword'],
            $data['newPassword']
        );

        Flight::json([
            'success' => true,
            'message' => 'Password changed successfully'
        ]);
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], 400);
    }
});

/**
 * @OA\Get(
 *     path="/users/{id}/borrowing-history",
 *     tags={"users"},
 *     summary="Get user borrowing history",
 *     operationId="getUserBorrowingHistory",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User borrowing history",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/BorrowingHistory")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="User not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/@id/borrowing-history', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $history = Flight::userService()->getUserBorrowingHistory($id);
        Flight::json($history);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Delete(
 *     path="/users/{id}",
 *     tags={"users"},
 *     summary="Delete user by ID",
 *     operationId="deleteUser",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="User deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="User not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('DELETE /users/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $result = Flight::userService()->delete($id);
        Flight::json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], 404);
    }
});

/**
 * @OA\Get(
 *     path="/profile",
 *     tags={"users"},
 *     summary="Get current user profile with role-specific fields",
 *     operationId="getCurrentUserProfile",
 *     @OA\Response(
 *         response=200,
 *         description="Current user profile",
 *         @OA\JsonContent(ref="#/components/schemas/UserProfile")
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Not authenticated",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Missing authentication token")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /profile', function () {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);

    $authUser = Flight::get('user');

    if (!$authUser || !isset($authUser->id)) {
        Flight::json(['error' => 'User not authenticated'], 401);
        return;
    }

    try {
        $profile = Flight::userService()->getFullProfile($authUser->id, $authUser->role);
        Flight::json($profile);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 404);
    }
});

/**
 * @OA\Get(
 *     path="/users/{id}/subscription",
 *     tags={"subscription"},
 *     summary="Get user subscription status",
 *     operationId="getSubscriptionStatus",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Subscription status",
 *         @OA\JsonContent(
 *             @OA\Property(property="status", type="string", example="Active"),
 *             @OA\Property(property="expiration_date", type="string", format="date", example="2025-12-31"),
 *             @OA\Property(property="days_remaining", type="integer", example=30)
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="User not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/@id/subscription', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $status = Flight::userService()->getSubscriptionStatus((int) $id);
        Flight::json($status);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 404);
    }
});

/**
 * @OA\Get(
 *     path="/users/subscription/expiring-soon",
 *     tags={"subscription"},
 *     summary="Get users whose subscriptions expire soon (librarian only)",
 *     operationId="getExpiringSoonUsers",
 *     @OA\Response(
 *         response=200,
 *         description="List of users with expiring subscriptions",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/User")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/subscription/expiring-soon', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $users = Flight::userService()->getUsersExpiringSoon(7);
        Flight::json($users);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/users/subscription/expired",
 *     tags={"subscription"},
 *     summary="Get users with expired subscriptions (librarian only)",
 *     operationId="getExpiredUsers",
 *     @OA\Response(
 *         response=200,
 *         description="List of users with expired subscriptions",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/User")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/subscription/expired', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $users = Flight::userService()->getExpiredUsers();
        Flight::json($users);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Post(
 *     path="/users/{id}/subscription/renew",
 *     tags={"subscription"},
 *     summary="Renew a user's subscription (librarian only)",
 *     operationId="renewSubscription",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"expiration_date"},
 *             @OA\Property(property="expiration_date", type="string", format="date", example="2026-12-31")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Subscription renewed successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Subscription renewed successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="expiration_date is required")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="User not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="User not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('POST /users/@id/subscription/renew', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $body = Flight::request()->getBody();
        $data = json_decode($body, true);
        $newExpDate = $data['expiration_date'] ?? '';
        $authUser = Flight::get('user');
        $librarianId = (int) $authUser->id;

        if (empty($newExpDate)) {
            Flight::json(['error' => 'expiration_date is required'], 400);
            return;
        }

        Flight::userService()->renewSubscription((int) $id, $newExpDate, $librarianId);
        Flight::json(['success' => true, 'message' => 'Subscription renewed successfully']);
    } catch (InvalidArgumentException $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 404);
    }
});

/**
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="email", type="string", format="email", example="user@example.com"),
 *     @OA\Property(property="name", type="string", example="John"),
 *     @OA\Property(property="surname", type="string", example="Doe"),
 *     @OA\Property(property="phone", type="string", example="+1234567890"),
 *     @OA\Property(property="date_of_birth", type="string", format="date", example="1990-05-15"),
 *     @OA\Property(property="date_joined", type="string", format="date", example="2024-01-20")
 * )
 */

/**
 * @OA\Schema(
 *     schema="BorrowingHistory",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Harry Potter and the Philosopher's Stone"),
 *     @OA\Property(property="author_name", type="string", example="J.K. Rowling"),
 *     @OA\Property(property="borrow_date", type="string", format="date", example="2024-01-15"),
 *     @OA\Property(property="due_date", type="string", format="date", example="2024-01-29"),
 *     @OA\Property(property="return_date", type="string", format="date", example="2024-01-25"),
 *     @OA\Property(property="borrowing_status", type="string", example="Returned", enum={"Active", "Returned"})
 * )
 */