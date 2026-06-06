<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../services/BorrowingService.php';

/**
 * Tests for BorrowingService — borrow and return validation.
 *
 * BorrowingDao is mocked so no database connection is required.
 * We verify that the service correctly enforces business rules
 * such as preventing double-returns and invalid return dates.
 */
class BorrowingServiceTest extends TestCase
{
    private $borrowingDaoMock;
    private BorrowingService $borrowingService;

    protected function setUp(): void
    {
        $this->borrowingDaoMock = $this->createMock(BorrowingDao::class);

        $this->borrowingService = new BorrowingService();

        $reflection = new ReflectionClass($this->borrowingService);
        $daoProperty = $reflection->getParentClass()->getProperty('dao');
        $daoProperty->setAccessible(true);
        $daoProperty->setValue($this->borrowingService, $this->borrowingDaoMock);
    }

    public function testReturnBookWithEmptyDateThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/return date/i');

        $this->borrowingService->returnBook(1, '');
    }

    public function testReturnAlreadyReturnedBookThrowsException(): void
    {
        $this->borrowingDaoMock
            ->method('getById')
            ->willReturn([
                'id'          => 1,
                'book_id'     => 10,
                'borrow_date' => '2025-01-01',
                'status'      => 'Returned',
            ]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessageMatches('/already been returned/i');

        $this->borrowingService->returnBook(1, '2025-01-15');
    }

    public function testReturnDateBeforeBorrowDateThrowsException(): void
    {
        $this->borrowingDaoMock
            ->method('getById')
            ->willReturn([
                'id'          => 1,
                'book_id'     => 10,
                'borrow_date' => '2025-06-01',
                'status'      => 'Active',
            ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/cannot be before/i');

        $this->borrowingService->returnBook(1, '2025-05-01');
    }

    public function testBorrowBookWithMissingBookIdThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->borrowingService->borrowBook(0, 1, 1);
    }

    public function testBorrowBookWithMissingUserIdThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->borrowingService->borrowBook(1, 0, 1);
    }

    public function testBorrowBookWithMissingLibrarianIdThrowsException(): void
    {
        $this->expectException(InvalidArgumentException::class);

        $this->borrowingService->borrowBook(1, 1, 0);
    }
}