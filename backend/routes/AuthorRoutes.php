<?php

declare(strict_types=1);

/**
 * @OA\Get(
 *     path="/authors",
 *     tags={"authors"},
 *     summary="Get all authors",
 *     operationId="getAllAuthors",
 *     @OA\Response(
 *         response=200,
 *         description="List of all authors",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Author")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /authors', function () {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $authors = Flight::authorService()->getAll();
        Flight::json($authors);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/authors/{id}",
 *     tags={"authors"},
 *     summary="Get author by ID",
 *     operationId="getAuthorById",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Author ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Author details",
 *         @OA\JsonContent(ref="#/components/schemas/Author")
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Author not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Author not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /authors/@id', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $author = Flight::authorService()->getById($id);
        if ($author) {
            Flight::json($author);
        } else {
            Flight::json(['error' => 'Author not found'], 404);
        }
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/authors/{id}/books",
 *     tags={"authors"},
 *     summary="Get books by author",
 *     operationId="getBooksByAuthor",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Author ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of books by author",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Book")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Author not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Author not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /authors/@id/books', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $books = Flight::authorService()->getBooksByAuthor($id);
        Flight::json($books);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Post(
 *     path="/authors",
 *     tags={"authors"},
 *     summary="Create a new author",
 *     operationId="createAuthor",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Author creation data",
 *         @OA\JsonContent(
 *             required={"name"},
 *             @OA\Property(property="name", type="string", minLength=2, example="J.K. Rowling"),
 *             @OA\Property(property="biography", type="string", example="British author famous for Harry Potter series")
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Author created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="author_id", type="integer", example=1),
 *             @OA\Property(property="message", type="string", example="Author created successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Author name is required")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('POST /authors', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $authorId = Flight::authorService()->createAuthor($data);
        Flight::json([
            'success' => true,
            'author_id' => $authorId,
            'message' => 'Author created successfully'
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
        ], 500);
    }
});

/**
 * @OA\Put(
 *     path="/authors/{id}",
 *     tags={"authors"},
 *     summary="Update author by ID",
 *     operationId="updateAuthor",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Author ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         description="Author update data",
 *         @OA\JsonContent(
 *             @OA\Property(property="name", type="string", minLength=2, example="Updated Author Name"),
 *             @OA\Property(property="biography", type="string", example="Updated biography")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Author updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Author updated successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Author name cannot be empty")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Author not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Author not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PUT /authors/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::authorService()->updateAuthor($id, $data);
        Flight::json([
            'success' => true,
            'message' => 'Author updated successfully'
        ]);
    } catch (InvalidArgumentException $e) {
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], 400);
    } catch (Exception $e) {
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], 404);
    }
});

/**
 * @OA\Delete(
 *     path="/authors/{id}",
 *     tags={"authors"},
 *     summary="Delete author by ID",
 *     operationId="deleteAuthor",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Author ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Author deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Author deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Author not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Author not found")
 *         )
 *     ),
 *     @OA\Response(
 *         response=409,
 *         description="Conflict - author has books",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Cannot delete author with existing books")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('DELETE /authors/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $result = Flight::authorService()->deleteAuthor($id);
        Flight::json([
            'success' => true,
            'message' => 'Author deleted successfully'
        ]);
    } catch (Exception $e) {
        $statusCode = 500;
        if (strpos($e->getMessage(), 'not found') !== false) {
            $statusCode = 404;
        } elseif (strpos($e->getMessage(), 'cannot delete') !== false) {
            $statusCode = 409;
        }
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], $statusCode);
    }
});

/**
 * @OA\Schema(
 *     schema="Author",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="J.K. Rowling"),
 *     @OA\Property(property="biography", type="string", example="British author famous for Harry Potter series")
 * )
 */