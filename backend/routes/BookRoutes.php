<?php

declare(strict_types=1);

/**
 * @OA\Get(
 *     path="/books",
 *     tags={"books"},
 *     summary="Get all books",
 *     operationId="getAllBooks",
 *     @OA\Response(
 *         response=200,
 *         description="List of all books",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Book")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /books', function () {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $books = Flight::bookService()->getAll();
        Flight::json($books);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});


/**
 * @OA\Get(
 *     path="/books/{id}",
 *     tags={"books"},
 *     summary="Get book by ID",
 *     operationId="getBookById",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Book ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book details",
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer", example=1),
 *             @OA\Property(property="title", type="string", example="The Great Gatsby"),
 *             @OA\Property(property="author_name", type="string", example="F. Scott Fitzgerald"),
 *             @OA\Property(property="biography", type="string", example="American novelist..."),
 *             @OA\Property(property="ISBN", type="string", example="9780743273565"),
 *             @OA\Property(property="publication_year", type="integer", example=1925),
 *             @OA\Property(property="genre", type="string", example="Fiction"),
 *             @OA\Property(property="summary", type="string", example="The tragic story of Jay Gatsby..."),
 *             @OA\Property(property="status", type="string", example="Available"),
 *             @OA\Property(property="cover_image", type="string", example="book-1.jpg"),
 *             @OA\Property(property="created_at", type="string", format="date-time"),
 *             @OA\Property(property="updated_at", type="string", format="date-time")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Book not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="error", type="string", example="Book not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /books/@id', function ($id) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $book = Flight::bookService()->getBookWithDetails($id);
        if ($book) {
            Flight::json($book);
        } else {
            Flight::json(['error' => 'Book not found'], 404);
        }
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Get(
 *     path="/books/genre/{genre}",
 *     tags={"books"},
 *     summary="Get books by genre",
 *     operationId="getBooksByGenre",
 *     @OA\Parameter(
 *         name="genre",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="string", example="Fantasy"),
 *         description="Book genre"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="List of books by genre",
 *         @OA\JsonContent(
 *             type="array",
 *             @OA\Items(ref="#/components/schemas/Book")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('GET /books/genre/@genre', function ($genre) {
    Flight::auth_middleware()->authorizeRoles([Roles::USER, Roles::LIBRARIAN]);
    try {
        $books = Flight::bookService()->getBooksByGenre($genre);
        Flight::json($books);
    } catch (Exception $e) {
        Flight::json(['error' => $e->getMessage()], 500);
    }
});

/**
 * @OA\Post(
 *     path="/books",
 *     tags={"books"},
 *     summary="Create a new book",
 *     operationId="createBook",
 *     @OA\RequestBody(
 *         required=true,
 *         description="Book creation data",
 *         @OA\JsonContent(
 *             required={"title", "author_id", "genre"},
 *             @OA\Property(property="title", type="string", example="Harry Potter and the Philosopher's Stone"),
 *             @OA\Property(property="author_id", type="integer", example=1),
 *             @OA\Property(property="genre", type="string", example="Fantasy"),
 *             @OA\Property(property="publication_year", type="integer", example=1997),
 *             @OA\Property(property="ISBN", type="string", example="9780439708180"),
 *             @OA\Property(property="summary", type="string", example="The first book in the Harry Potter series"),
 *             @OA\Property(property="status", type="string", example="Available", enum={"Available", "Borrowed", "Maintenance"})
 *         )
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Book created successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="book_id", type="integer", example=1),
 *             @OA\Property(property="message", type="string", example="Book created successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Book title is required")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('POST /books', function () {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $bookId = Flight::bookService()->createBook($data);
        Flight::json([
            'success' => true,
            'book_id' => $bookId,
            'message' => 'Book created successfully'
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
 *     path="/books/{id}",
 *     tags={"books"},
 *     summary="Update book by ID",
 *     operationId="updateBook",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Book ID"
 *     ),
 *     @OA\RequestBody(
 *         required=true,
 *         description="Book update data",
 *         @OA\JsonContent(
 *             @OA\Property(property="title", type="string", example="Updated Book Title"),
 *             @OA\Property(property="author_id", type="integer", example=1),
 *             @OA\Property(property="genre", type="string", example="Updated Genre"),
 *             @OA\Property(property="publication_year", type="integer", example=1998),
 *             @OA\Property(property="ISBN", type="string", example="9780439708181"),
 *             @OA\Property(property="summary", type="string", example="Updated book description"),
 *             @OA\Property(property="status", type="string", example="Available", enum={"Available", "Borrowed", "Maintenance"}),
 *             @OA\Property(property="cover_image", type="string", example="book-1.jpg")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Book updated successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid input",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Publication year cannot be in the future")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Book not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Book not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PUT /books/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $result = Flight::bookService()->updateBook($id, $data);
        Flight::json([
            'success' => true,
            'message' => 'Book updated successfully'
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
 * @OA\Patch(
 *     path="/books/{id}/status",
 *     tags={"books"},
 *     summary="Update book status",
 *     operationId="updateBookStatus",
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
 *             required={"status"},
 *             @OA\Property(property="status", type="string", example="Borrowed", enum={"Available", "Borrowed", "Maintenance"})
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book status updated successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Book status updated successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Invalid status",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Invalid status")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Book not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Book not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('PATCH /books/@id/status', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $data = Flight::request()->data->getData();
        $status = $data['status'];
        $result = Flight::bookService()->updateStatus($id, $status);
        Flight::json([
            'success' => true,
            'message' => 'Book status updated successfully'
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
 *     path="/books/{id}",
 *     tags={"books"},
 *     summary="Delete book by ID",
 *     operationId="deleteBook",
 *     @OA\Parameter(
 *         name="id",
 *         in="path",
 *         required=true,
 *         @OA\Schema(type="integer", example=1),
 *         description="Book ID"
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Book deleted successfully",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=true),
 *             @OA\Property(property="message", type="string", example="Book deleted successfully")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Cannot delete borrowed book",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Cannot delete a book that is currently borrowed")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Book not found",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean", example=false),
 *             @OA\Property(property="error", type="string", example="Book not found")
 *         )
 *     ),
 *     security={{"ApiKey": {}}}
 * )
 */
Flight::route('DELETE /books/@id', function ($id) {
    Flight::auth_middleware()->authorizeRole(Roles::LIBRARIAN);
    try {
        $result = Flight::bookService()->deleteBook($id);
        Flight::json([
            'success' => true,
            'message' => 'Book deleted successfully'
        ]);
    } catch (Exception $e) {
        $statusCode = 500;
        if (strpos($e->getMessage(), 'not found') !== false) {
            $statusCode = 404;
        } elseif (strpos($e->getMessage(), 'cannot delete') !== false) {
            $statusCode = 400;
        }
        Flight::json([
            'success' => false,
            'error' => $e->getMessage()
        ], $statusCode);
    }
});

/**
 * @OA\Schema(
 *     schema="Book",
 *     type="object",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Harry Potter and the Philosopher's Stone"),
 *     @OA\Property(property="author_id", type="integer", example=1),
 *     @OA\Property(property="author_name", type="string", example="J.K. Rowling"),
 *     @OA\Property(property="genre", type="string", example="Fantasy"),
 *     @OA\Property(property="publication_year", type="integer", example=1997),
 *     @OA\Property(property="ISBN", type="string", example="9780439708180"),
 *     @OA\Property(property="summary", type="string", example="The first book in the Harry Potter series"),
 *     @OA\Property(property="status", type="string", example="Available", enum={"Available", "Borrowed", "Maintenance"}),
 *     @OA\Property(property="cover_image", type="string", example="book-1.jpg")
 * )
 */