<?php

declare(strict_types=1);

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::group('/auth', function () {

    /**
     * @OA\Post(
     *     path="/auth/register",
     *     tags={"auth"},
     *     summary="Register a new user",
     *     operationId="registerUser",
     *     @OA\RequestBody(
     *         required=true,
     *         description="User registration data",
     *         @OA\JsonContent(
     *             required={"email", "password", "confirm_password", "name", "surname"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", minLength=8, example="SecurePass123!"),
     *             @OA\Property(property="name", type="string", minLength=2, example="John"),
     *             @OA\Property(property="surname", type="string", minLength=2, example="Doe"),
     *             @OA\Property(property="phone", type="string", nullable=true, example="+1234567890"),
     *             @OA\Property(property="date_of_birth", type="string", format="date", example="1990-05-15"),
     *             @OA\Property(property="date_joined", type="string", format="date", example="2024-01-20")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User registered successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="user_id", type="integer", example=1),
     *             @OA\Property(property="message", type="string", example="User registered successfully")
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
     *     @OA\Response(
     *         response=409,
     *         description="Conflict (email already exists)",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=false),
     *             @OA\Property(property="error", type="string", example="Email already registered")
     *         )
     *     )
     * )
     */
    Flight::route("POST /register", function () {
        try {
            $data = Flight::request()->data->getData();

            if (!isset($data['date_joined'])) {
                $data['date_joined'] = date('Y-m-d');
            }
            $userId = Flight::authservice()->registerUser($data);

            Flight::json([
                'success' => true,
                'user_id' => $userId,
                'message' => 'User registered successfully'
            ], 201);
        } catch (InvalidArgumentException $e) {
            Flight::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 400);
        } catch (Exception $e) {
            Flight::json([
                'success' => false,
                'error' => $e->getMessage()
            ], 409);
        }
    });

    /**
     * @OA\Post(
     *     path="/auth/login",
     *     tags={"auth"},
     *     summary="Login user",
     *     operationId="loginUser",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email", "password"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="SecurePass123!")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", ref="#/components/schemas/User"),
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
    Flight::route('POST /login', function () {
        $data = Flight::request()->data->getData();

        $result = Flight::authservice()->login($data);

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
});