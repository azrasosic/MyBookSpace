<?php

declare(strict_types=1);

/**
 * @OA\Get(
 *     path="/books/{bookId}/reviews/my",
 *     tags={"reviews"},
 *     summary="Check if current user has reviewed this book",
 *     operationId="getMyReview",
 *     @OA\Parameter(
 *         name="bookId",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Book ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Review status",
 *         @OA\JsonContent(
 *             @OA\Property(property="can_review", type="boolean", example=true),
 *             @OA\Property(property="existing_review", type="object", nullable=true)
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /books/@bookId/reviews/my', function ($bookId) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $authUser = Flight::get('user');
        $userId   = (int) $authUser->id;
        $canReview = Flight::reviewService()->canUserReview($userId, (int) $bookId);
        $existing  = Flight::reviewService()->getUserReviewForBook($userId, (int) $bookId);
        Flight::json([
            'can_review'      => $canReview,
            'existing_review' => $existing ?: null,
        ]);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/books/{id}/reviews",
 *     tags={"reviews"},
 *     summary="Get all reviews for a book",
 *     operationId="getBookReviews",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Book ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of reviews with average rating",
 *         @OA\JsonContent(
 *             type="object",
 *             @OA\Property(property="average_rating", type="number", format="float", example=4.5),
 *             @OA\Property(property="reviews", type="array", @OA\Items(ref="#/components/schemas/Review"))
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /books/@id/reviews', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $result = Flight::reviewService()->getReviewsForBook((int) $id);
        Flight::json($result);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Post(
 *     path="/books/{id}/reviews",
 *     tags={"reviews"},
 *     summary="Submit a review for a book",
 *     operationId="submitReview",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Book ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         @OA\JsonContent(
 *             required={"rating"},
 *             @OA\Property(property="rating", type="integer", minimum=1, maximum=5, example=4),
 *             @OA\Property(property="comment", type="string", maxLength=500, example="Great book!")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Review submitted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Review submitted successfully"),
 *             @OA\Property(property="review_id", type="integer", example=1),
 *             @OA\Property(property="action", type="string", example="created")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Please select a star rating")
 *         )
 *     ),
 *     @OA\Response(
 *         response=403,
 *         description="Forbidden - user cannot review this book",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="You can only review books you have borrowed and returned")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('POST /books/@id/reviews', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::USER);
    try {
        $authUser = Flight::get('user');
        $userId   = (int) $authUser->id;
        $data     = Flight::request()->data->getData();
        $rating   = isset($data['rating']) ? (int) $data['rating'] : 0;
        $comment  = $data['comment'] ?? null;
        if (!$rating) {
            Flight::json(['error' => 'Please select a star rating'], 400);
            return;
        }
        $result = Flight::reviewService()->submitReview($userId, (int) $id, $rating, $comment);
        Flight::json([
            'success'   => true,
            'message'   => 'Review submitted successfully',
            'review_id' => $result['review_id'],
            'action'    => $result['action'],
        ], 201);
    } catch (InvalidArgumentException $e) {
        Flight::json(['error' => $e->getMessage()], 400);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 403);
    }
});

/**
 * @OA\Get(
 *     path="/reviews",
 *     tags={"reviews"},
 *     summary="Get all reviews (librarian only)",
 *     operationId="getAllReviews",
 *     @OA\Response(
 *         response=200,
 *         description="List of all reviews",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/ReviewWithUser")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /reviews', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $reviews = Flight::reviewService()->getAllReviews();
        Flight::json($reviews);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Delete(
 *     path="/reviews/{id}",
 *     tags={"reviews"},
 *     summary="Delete a review (librarian only)",
 *     operationId="deleteReview",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Review ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Review deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Review deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Review not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Review not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('DELETE /reviews/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        Flight::reviewService()->deleteReview((int) $id);
        Flight::json(['success' => true, 'message' => 'Review deleted successfully']);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 404);
    }
});

/**
 * @OA\Schema(
 *     schema="Review",
 *     type="object",
 *     description="Stores book reviews submitted by users. Only users with a completed (returned) borrowing record for the book can submit a review.",
 *     @OA\Property(property="id", type="integer", example=1, description="Primary Key, Auto Increment"),
 *     @OA\Property(property="book_id", type="integer", example=1, description="References book.id"),
 *     @OA\Property(property="user_id", type="integer", example=1, description="References user.id"),
 *     @OA\Property(property="rating", type="integer", minimum=1, maximum=5, example=4, description="1–5 star rating"),
 *     @OA\Property(property="comment", type="string", maxLength=500, example="Great book!", description="Optional written feedback"),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-01-15 10:30:00", description="Submission time")
 * )
 */

/**
 * @OA\Schema(
 *     schema="ReviewWithUser",
 *     type="object",
 *     description="Review with user and book information for librarian moderation",
 *     allOf={
 *         @OA\Schema(ref="#/components/schemas/Review"),
 *         @OA\Schema(
 *             @OA\Property(property="book_title", type="string", example="Harry Potter and the Philosopher's Stone"),
 *             @OA\Property(property="user_name", type="string", example="John Doe")
 *         )
 *     }
 * )
 */