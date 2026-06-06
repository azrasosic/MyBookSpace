<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../services/UserService.php';

/**
 * Tests for UserService — password change and subscription renewal validation.
 *
 * UserDao is mocked so no database connection is required.
 * We verify that business rules around password changes and
 * subscription renewal dates are correctly enforced.
 */
class UserServiceTest extends TestCase
{
    private $userDaoMock;
    private UserService $userService;

    protected function setUp(): void
    {
        $this->userDaoMock = $this->createMock(UserDao::class);

        $this->userService = new UserService();

        $reflection = new ReflectionClass($this->userService);
        $daoProperty = $reflection->getParentClass()->getProperty('dao');
        $daoProperty->setAccessible(true);
        $daoProperty->setValue($this->userService, $this->userDaoMock);
    }

    public function testChangePasswordForNonExistentUserThrowsException(): void
    {
        $this->userDaoMock
            ->method('getUserByIdWithPassword')
            ->willReturn(false);

        $this->expectException(Exception::class);
        $this->expectExceptionMessageMatches('/not found/i');

        $this->userService->changePassword(999, 'oldpass', 'newpass123');
    }

    public function testChangePasswordWithWrongCurrentPasswordThrowsException(): void
    {
        $this->userDaoMock
            ->method('getUserByIdWithPassword')
            ->willReturn([
                'id'       => 1,
                'password' => password_hash('correctpassword', PASSWORD_DEFAULT),
            ]);

        $this->expectException(Exception::class);
        $this->expectExceptionMessageMatches('/incorrect/i');

        $this->userService->changePassword(1, 'wrongpassword', 'newpass123');
    }

    public function testChangePasswordWithShortNewPasswordThrowsException(): void
    {
        $this->userDaoMock
            ->method('getUserByIdWithPassword')
            ->willReturn([
                'id'       => 1,
                'password' => password_hash('correctpassword', PASSWORD_DEFAULT),
            ]);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/8 characters/i');

        $this->userService->changePassword(1, 'correctpassword', 'short');
    }

    public function testChangePasswordWithValidDataSucceeds(): void
    {
        $this->userDaoMock
            ->method('getUserByIdWithPassword')
            ->willReturn([
                'id'       => 1,
                'password' => password_hash('correctpassword', PASSWORD_DEFAULT),
            ]);

        $this->userDaoMock
            ->method('update')
            ->willReturn(true);

        $result = $this->userService->changePassword(1, 'correctpassword', 'newpassword123');
        $this->assertTrue($result);
    }

    public function testRenewSubscriptionForNonExistentUserThrowsException(): void
    {
        $this->userDaoMock
            ->method('getById')
            ->willReturn(false);

        $this->expectException(Exception::class);
        $this->expectExceptionMessageMatches('/not found/i');

        $this->userService->renewSubscription(999, '2027-01-01', 1);
    }

    public function testRenewSubscriptionWithInvalidDateFormatThrowsException(): void
    {
        $this->userDaoMock
            ->method('getById')
            ->willReturn(['id' => 1, 'name' => 'Test User']);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/invalid.*date/i');

        $this->userService->renewSubscription(1, '01-01-2027', 1);
    }

    public function testRenewSubscriptionWithPastDateThrowsException(): void
    {
        $this->userDaoMock
            ->method('getById')
            ->willReturn(['id' => 1, 'name' => 'Test User']);

        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessageMatches('/future/i');

        $pastDate = (new DateTime('-1 month'))->format('Y-m-d');
        $this->userService->renewSubscription(1, $pastDate, 1);
    }

    public function testRenewSubscriptionWithValidFutureDateSucceeds(): void
    {
        $this->userDaoMock
            ->method('getById')
            ->willReturn(['id' => 1, 'name' => 'Test User']);

        $this->userDaoMock
            ->method('renewSubscription')
            ->willReturn(true);

        $this->userService->renewSubscription(1, '2027-12-31', 1);

        $this->assertTrue(true);
    }
}