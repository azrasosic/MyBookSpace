<?php

declare(strict_types=1);

/**
 * @OA\Get(
 *     path="/librarians",
 *     tags={"librarians"},
 *     summary="Get all librarians",
 *     operationId="getAllLibrarians",
 *     @OA\Response(
 *         response=200,
 *         description="List of all librarians",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Librarian")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /librarians', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $librarians = Flight::librarianService()->getAll();
        // Remove passwords from response
        $librarians = array_map(function ($librarian) {
            unset($librarian['password']);
            return $librarian;
        }, $librarians);
        Flight::json($librarians);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/librarians/{id}",
 *     tags={"librarians"},
 *     summary="Get librarian by ID",
 *     operationId="getLibrarianById",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Librarian ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Librarian details",
 *         @OA\JsonContent(ref="#/components/schemas/Librarian")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Librarian not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Librarian not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /librarians/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $librarian = Flight::librarianService()->getById($id);
        if ($librarian) {
            unset($librarian['password']); // Remove password from response
            Flight::json($librarian);
        } else {
            Flight::json(['error' => 'Librarian not found'], 404);
        }
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Post(
 *     path="/librarians",
 *     tags={"librarians"},
 *     summary="Create a new librarian",
 *     operationId="createLibrarian",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Librarian creation data",
 *         @OA\JsonContent(
 *             required={"name", "surname", "email", "password", "employment_date"},
 *             @OA\Property(property="name", type="string", minLength=2, example="John"),
 *             @OA\Property(property="surname", type="string", minLength=2, example="Doe"),
 *             @OA\Property(property="email", type="string", format="email", example="john.doe@library.com"),
 *             @OA\Property(property="password", type="string", format="password", minLength=8, example="securePassword123"),
 *             @OA\Property(property="phone", type="string", example="+1234567890"),
 *             @OA\Property(property="date_of_birth", type="string", format="date", example="1985-03-15"),
 *             @OA\Property(property="employment_date", type="string", format="date", example="2024-01-15")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Librarian created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="librarian_id", type="integer", example=1),
 *             @OA\Property(property="message", type="string", example="Librarian created successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Email and password are required")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('POST /librarians', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $librarianId = Flight::librarianService()->createLibrarian($data);
        Flight::json([
            'success' => true,
            'librarian_id' => $librarianId,
            'message' => 'Librarian created successfully'
        ], 201);
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], 400);
    }
});

/**
 * @OA\Post(
 *     path="/librarians/login",
 *     tags={"librarians"},
 *     summary="Login librarian",
 *     operationId="loginLibrarian",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"email", "password"},
 *             @OA\Property(property="email", type="string", format="email", example="john.doe@library.com"),
 *             @OA\Property(property="password", type="string", format="password", example="securePassword123")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Login successful",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="data", ref="#/components/schemas/Librarian"),
 *             @OA\Property(property="message", type="string", example="Login successful")
 *         )
 *     ),
 *     @OA\Response(
 *         response=401,
 *         description="Unauthorized",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Invalid credentials")
 *         )
 *     )
 * )
 */
Flight::route('POST /librarians/login', function () {
    $data = Flight::request()->data->getData();

    $result = Flight::librarianService()->login($data);

    if ($result['success'] === true) {
        Flight::json([
            'success' => true,
            'data' => $result['data'],
            'message' => 'Login successful'
        ]);
    } else {
        Flight::json([
            'success' => false,
            'error' => $result['error']
        ], 401);
    }
});

/**
 * @OA\Patch(
 *     path="/librarians/{id}/profile",
 *     tags={"librarians"},
 *     summary="Update librarian profile (partial updates)",
 *     operationId="updateLibrarianProfile",
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
 *             @OA\Property(property="email", type="string", format="email", example="jonathan.smith@library.com"),
 *             @OA\Property(property="phone", type="string", example="+9876543210"),
 *             @OA\Property(property="date_of_birth", type="string", format="date", example="1985-03-15")
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
 *         description="Librarian not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Librarian not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PATCH /librarians/@id/profile', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $updated = Flight::librarianService()->updateProfile($id, $data);

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
 *     path="/librarians/{id}/password",
 *     tags={"librarians"},
 *     summary="Change librarian password",
 *     operationId="changeLibrarianPassword",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Librarian ID"
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
 *         description="Librarian not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Librarian not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PUT /librarians/@id/password', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::librarianService()->changePassword(
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
 * @OA\Delete(
 *     path="/librarians/{id}",
 *     tags={"librarians"},
 *     summary="Delete librarian by ID",
 *     operationId="deleteLibrarian",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Librarian ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Librarian deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Librarian deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Librarian not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Librarian not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('DELETE /librarians/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $result = Flight::librarianService()->delete($id);
        Flight::json([
            'success' => true,
            'message' => 'Librarian deleted successfully'
        ]);
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], 404);
    }
});

/**
 * @OA\Schema(
 *     schema="Librarian",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John"),
 *     @OA\Property(property="surname", type="string", example="Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john.doe@library.com"),
 *     @OA\Property(property="phone", type="string", example="+1234567890"),
 *     @OA\Property(property="date_of_birth", type="string", format="date", example="1985-03-15"),
 *     @OA\Property(property="employment_date", type="string", format="date", example="2024-01-15")
 * )
 */