<?php

declare(strict_types=1);

/**
 * @OA\Get(
 *     path="/users/{id}/favourites",
 *     tags={"favourites"},
 *     summary="Get user's favourite books",
 *     operationId="getUserFavourites",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of favourite books",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Book")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/@id/favourites', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $favourites = Flight::favouriteService()->getUserFavourites((int) $id);
        Flight::json($favourites);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/users/{userId}/favourites/{bookId}/status",
 *     tags={"favourites"},
 *     summary="Check if a book is in user's favourites",
 *     operationId="getFavouriteStatus",
 *     @OA\Parameter(
 *         name="userId",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Parameter(
 *         name="bookId",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Book ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Favourite status",
 *         @OA\JsonContent(
 *             @OA\Property(property="is_favourite", type="boolean", example=true)
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /users/@userId/favourites/@bookId/status', function ($userId, $bookId) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $isFavourite = Flight::favouriteService()->isFavourite((int) $userId, (int) $bookId);
        Flight::json(['is_favourite' => $isFavourite]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Post(
 *     path="/users/{id}/favourites",
 *     tags={"favourites"},
 *     summary="Toggle favourite status (add/remove)",
 *     operationId="toggleFavourite",
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
 *             required={"book_id"},
 *             @OA\Property(property="book_id", type="integer", example=1)
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Favourite toggled successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="is_favourite", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Book added to favourites")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="book_id is required")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('POST /users/@id/favourites', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $body   = Flight::request()->getBody();
        $data   = json_decode($body, true);
        $bookId = (int) ($data['book_id'] ?? 0);
        if (!$bookId) {
            Flight::json(['error' => 'book_id is required'], 400);
            return;
        }
        $result = Flight::favouriteService()->toggleFavourite((int) $id, $bookId);
        Flight::json([
            'success' => true,
            'is_favourite' => $result['is_favourite'],
            'message' => $result['action'] === 'added'
                ? 'Book added to favourites'
                : 'Book removed from favourites'
        ]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Delete(
 *     path="/users/{userId}/favourites/{bookId}",
 *     tags={"favourites"},
 *     summary="Remove a book from favourites",
 *     operationId="removeFavourite",
 *     @OA\Parameter(
 *         name="userId",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="User ID"
 *     ),
 *     @OA\Parameter(
 *         name="bookId",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Book ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book removed from favourites",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Book removed from favourites")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Error",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Something went wrong")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('DELETE /users/@userId/favourites/@bookId', function ($userId, $bookId) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        Flight::favouriteService()->removeFavourite((int) $userId, (int) $bookId);
        Flight::json(['success' => true, 'message' => 'Book removed from favourites']);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    }
});

/**
 * @OA\Schema(
 *     schema="Favourite",
 *     type="object",
 *     description="Stores books that users have saved to their personal favourites list for quick access",
 *     @OA\Property(property="id", type="integer", example=1, description="Primary Key, Auto Increment"),
 *     @OA\Property(property="user_id", type="integer", example=1, description="References user.id"),
 *     @OA\Property(property="book_id", type="integer", example=1, description="References book.id"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-01-15 10:30:00", description="When the book was added to favourites")
 * )
 */