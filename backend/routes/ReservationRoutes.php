<?php

declare(strict_types=1);

/**
 * @OA\Post(
 *     path="/reservations",
 *     tags={"reservations"},
 *     summary="Create a new reservation",
 *     operationId="createReservation",
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"book_id"},
 *             @OA\Property(property="book_id", type="integer", example=1)
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Reservation created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="reservation_id", type="integer", example=1),
 *             @OA\Property(property="message", type="string", example="Book reserved successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="book_id is required")
 *         )
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Conflict - reservation not allowed",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Book is already reserved")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('POST /reservations', function () {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $data     = Flight::request()->data->getData();
        $authUser = Flight::get('user');
        $userId   = (int) $authUser->id;
        $bookId   = (int) ($data['book_id'] ?? 0);
        if (!$bookId) {
            Flight::json(['error' => 'book_id is required'], 400);
            return;
        }
        $reservationId = Flight::reservationService()->createReservation($userId, $bookId);
        Flight::json([
            'success'        => true,
            'reservation_id' => $reservationId,
            'message'        => 'Book reserved successfully. You will be notified when it becomes available.'
        ], 201);
    } catch (InvalidArgumentException $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 409);
    }
});

/**
 * @OA\Get(
 *     path="/users/{id}/reservations",
 *     tags={"reservations"},
 *     summary="Get user's active reservations",
 *     operationId="getUserReservations",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of user's reservations",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Reservation")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/@id/reservations', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $reservations = Flight::reservationService()->getUserReservations((int) $id);
        Flight::json($reservations);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Delete(
 *     path="/reservations/{id}",
 *     tags={"reservations"},
 *     summary="Cancel a reservation",
 *     operationId="cancelReservation",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Reservation ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Reservation cancelled successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Reservation cancelled successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Cannot cancel this reservation")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('DELETE /reservations/@id', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $authUser = Flight::get('user');
        if ($authUser->role === Roles::USER) {
            Flight::reservationService()->cancelReservation((int) $id, (int) $authUser->id);
        } else {
            Flight::reservationService()->updateReservationStatus((int) $id, 'Cancelled');
        }
        Flight::json(['success' => true, 'message' => 'Reservation cancelled successfully']);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Get(
 *     path="/reservations",
 *     tags={"reservations"},
 *     summary="Get all reservations (librarian only)",
 *     operationId="getAllReservations",
 *     @OA\Response(
 *         response=200,
 *         description="List of all reservations",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Reservation")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /reservations', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $reservations = Flight::reservationService()->getAllReservations();
        Flight::json($reservations);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Patch(
 *     path="/reservations/{id}/status",
 *     tags={"reservations"},
 *     summary="Update reservation status (librarian only)",
 *     operationId="updateReservationStatus",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Reservation ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"status"},
 *             @OA\Property(property="status", type="string", example="Collected", enum={"Pending","Available for Pickup","Collected","Cancelled"})
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Reservation status updated",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Reservation status updated")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid status",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Invalid status value")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PATCH /reservations/@id/status', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data   = Flight::request()->data->getData();
        $status = $data['status'] ?? '';
        Flight::reservationService()->updateReservationStatus((int) $id, $status);
        Flight::json(['success' => true, 'message' => 'Reservation status updated']);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Schema(
 *     schema="Reservation",
 *     type="object",
 *     description="Tracks book reservations made by users for currently borrowed books. Status is automatically updated to 'Available for Pickup' when the book is returned.",
 *     @OA\Property(property="id", type="integer", example=1, description="Primary Key, Auto Increment"),
 *     @OA\Property(property="book_id", type="integer", example=1, description="References book.id"),
 *     @OA\Property(property="user_id", type="integer", example=1, description="References user.id"),
 *     @OA\Property(property="book_title", type="string", example="Harry Potter and the Philosopher's Stone", description="Book title"),
 *     @OA\Property(property="author_name", type="string", example="J.K. Rowling", description="Author name"),
 *     @OA\Property(property="user_name", type="string", example="John Doe", description="User full name"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-01-15 10:30:00", description="Reservation creation time"),
 *     @OA\Property(property="status", type="string", enum={"Pending", "Available for Pickup", "Collected", "Cancelled"}, example="Pending")
 * )
 */