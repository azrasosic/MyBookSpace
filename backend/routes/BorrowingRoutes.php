<?php

declare(strict_types=1);

/**
 * @OA\Get(
 *     path="/borrowings",
 *     tags={"borrowings"},
 *     summary="Get all borrowings",
 *     operationId="getAllBorrowings",
 *     @OA\Response(
 *         response=200,
 *         description="List of all borrowings",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Borrowing")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /borrowings', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $borrowings = Flight::borrowingService()->getAll();
        Flight::json($borrowings);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/borrowings/{id}",
 *     tags={"borrowings"},
 *     summary="Get borrowing by ID",
 *     operationId="getBorrowingById",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Borrowing ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Borrowing details",
 *         @OA\JsonContent(ref="#/components/schemas/Borrowing")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Borrowing not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Borrowing not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /borrowings/@id', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $borrowing = Flight::borrowingService()->getById($id);
        if ($borrowing) {
            Flight::json($borrowing);
        } else {
            Flight::json(['error' => 'Borrowing not found'], 404);
        }
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/users/{id}/active-borrowings",
 *     tags={"borrowings"},
 *     summary="Get user's active borrowings",
 *     operationId="getUserActiveBorrowings",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="User's active borrowings",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/BorrowingWithDetails")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid user ID",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="User ID is required")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/@id/active-borrowings', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $borrowings = Flight::borrowingService()->getUserActiveBorrowings($id);
        Flight::json($borrowings);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Post(
 *     path="/borrowings",
 *     tags={"borrowings"},
 *     summary="Borrow a book",
 *     operationId="borrowBook",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Borrowing data",
 *         @OA\JsonContent(
 *             required={"book_id", "user_id", "librarian_id"},
 *             @OA\Property(property="book_id", type="integer", example=1),
 *             @OA\Property(property="user_id", type="integer", example=1),
 *             @OA\Property(property="librarian_id", type="integer", example=1),
 *             @OA\Property(property="borrow_date", type="string", format="date", example="2024-01-15"),
 *             @OA\Property(property="due_date", type="string", format="date", example="2024-01-29")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Book borrowed successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="borrowing_id", type="integer", example=1),
 *             @OA\Property(property="message", type="string", example="Book borrowed successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Book ID, User ID, and Librarian ID are required")
 *         )
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Conflict - book not available or user limit reached",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Book is not available for borrowing")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('POST /borrowings', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $borrowingId = Flight::borrowingService()->borrowBook(
            $data['book_id'],
            $data['user_id'],
            $data['librarian_id']
        );
        Flight::json([
            'success' => true,
            'borrowing_id' => $borrowingId,
            'message' => 'Book borrowed successfully'
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
 * @OA\Put(
 *     path="/borrowings/{id}/return",
 *     tags={"borrowings"},
 *     summary="Return a borrowed book",
 *     operationId="returnBook",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Borrowing ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"return_date"},
 *             @OA\Property(property="return_date", type="string", format="date", example="2024-01-25")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book returned successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Book returned successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Return date is required")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Borrowing not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Borrowing record not found")
 *         )
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Book already returned",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Book has already been returned")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PUT /borrowings/@id/return', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::borrowingService()->returnBook($id, $data['return_date']);
        Flight::json([
            'success' => true,
            'message' => 'Book returned successfully'
        ]);
    } catch (InvalidArgumentException $e) {
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], 400);
    } catch (Exception $e) {
        $statusCode = 500;
        if (strpos($e->getMessage(), 'not found') !== false) {
            $statusCode = 404;
        } elseif (strpos($e->getMessage(), 'already been returned') !== false) {
            $statusCode = 409;
        }
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], $statusCode);
    }
});

/**
 * @OA\Delete(
 *     path="/borrowings/{id}",
 *     tags={"borrowings"},
 *     summary="Delete borrowing record",
 *     operationId="deleteBorrowing",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Borrowing ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Borrowing record deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Borrowing record deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Borrowing not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Borrowing not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('DELETE /borrowings/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $result = Flight::borrowingService()->delete($id);
        Flight::json([
            'success' => true,
            'message' => 'Borrowing record deleted successfully'
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
 *     schema="Borrowing",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="book_id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="librarian_id", type="integer", example=1),
 *     @OA\Property(property="borrow_date", type="string", format="date", example="2024-01-15"),
 *     @OA\Property(property="due_date", type="string", format="date", example="2024-01-29"),
 *     @OA\Property(property="return_date", type="string", format="date", example="2024-01-25"),
 *     @OA\Property(property="status", type="string", example="Returned", enum={"Active", "Returned"})
 * )
 */

/**
 * @OA\Schema(
 *     schema="BorrowingWithDetails",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="book_id", type="integer", example=1),
 *     @OA\Property(property="book_title", type="string", example="Harry Potter and the Philosopher's Stone"),
 *     @OA\Property(property="author_name", type="string", example="J.K. Rowling"),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="user_name", type="string", example="John Doe"),
 *     @OA\Property(property="librarian_id", type="integer", example=1),
 *     @OA\Property(property="librarian_name", type="string", example="Jane Smith"),
 *     @OA\Property(property="borrow_date", type="string", format="date", example="2024-01-15"),
 *     @OA\Property(property="due_date", type="string", format="date", example="2024-01-29"),
 *     @OA\Property(property="return_date", type="string", format="date", example="2024-01-25"),
 *     @OA\Property(property="status", type="string", example="Returned", enum={"Active", "Returned"})
 * )
 */