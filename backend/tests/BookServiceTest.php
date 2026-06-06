<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../services/BookService.php';

/**
 * Tests for BookService — book creation and deletion validation.
 *
 * BookDao is mocked so no database connection is required.
 * We verify that required fields are enforced and that business
 * rules (e.g. no deleting a borrowed book) are respected.
 */
class BookServiceTest extends TestCase
{
    private $bookDaoMock;
    private BookService $bookService;

    protected function setUp(): void
    {
        $this->bookDaoMock = $this->createMock(BookDao::class);

        $this->bookService = new BookService();

        $reflection = new ReflectionClass($this->bookService);
        $daoProperty = $reflection->getParentClass()->getProperty('dao');
        $daoProperty->setAccessible(true);
        $daoProperty->setValue($this->bookService, $this->bookDaoMock);
    }

    public function testCreateBookWithoutTitleThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/title/i');

        $this->bookService->createBook([
            'author_id' => 1,
            'genre'     => 'Fiction',
        ]);
    }

    public function testCreateBookWithoutAuthorIdThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/author/i');

        $this->bookService->createBook([
            'title' => 'Test Book',
            'genre' => 'Fiction',
        ]);
    }

    public function testCreateBookWithoutGenreThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/genre/i');

        $this->bookService->createBook([
            'title'     => 'Test Book',
            'author_id' => 1,
        ]);
    }

    public function testCreateBookWithFuturePublicationYearThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/future/i');

        $this->bookService->createBook([
            'title'            => 'Future Book',
            'author_id'        => 1,
            'genre'            => 'Fiction',
            'publication_year' => (int) date('Y') + 5,
        ]);
    }

    public function testCreateValidBookCallsInsert(): void
    {
        $this->bookDaoMock
            ->method('insert')
            ->willReturn(99);

        $result = $this->bookService->createBook([
            'title'     => 'Valid Book',
            'author_id' => 1,
            'genre'     => 'Fiction',
        ]);

        $this->assertSame(99, $result);
    }

    public function testDeleteNonExistentBookThrowsException(): void
    {
        $this->bookDaoMock
            ->method('getById')
            ->willReturn(false);

        $this->expectException(Exception::class);
        $this->expectExceptionMessageMatches('/not found/i');

        $this->bookService->deleteBook(999);
    }

    public function testDeleteBorrowedBookThrowsException(): void
    {
        $this->bookDaoMock
            ->method('getById')
            ->willReturn([
                'id'     => 1,
                'title'  => 'Borrowed Book',
                'status' => 'Borrowed',
            ]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessageMatches('/currently borrowed/i');

        $this->bookService->deleteBook(1);
    }

    public function testDeleteAvailableBookSucceeds(): void
    {
        $this->bookDaoMock
            ->method('getById')
            ->willReturn([
                'id'     => 1,
                'title'  => 'Available Book',
                'status' => 'Available',
            ]);

        $this->bookDaoMock
            ->method('delete')
            ->willReturn(true);

        $result = $this->bookService->deleteBook(1);
        $this->assertTrue($result);
    }
}