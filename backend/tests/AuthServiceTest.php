<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../services/AuthService.php';

/**
 * Tests for AuthService — registration and login validation.
 *
 * AuthDao is mocked so no database connection is required.
 * We verify that the service enforces its own validation rules
 * and that passwords are never returned in the response.
 */
class AuthServiceTest extends TestCase
{
    private $authDaoMock;
    private AuthService $authService;

    protected function setUp(): void
    {
        $this->authDaoMock = $this->createMock(AuthDao::class);

        $this->authService = new AuthService();

        $reflection = new ReflectionClass($this->authService);
        $property = $reflection->getProperty('authDao');
        $property->setAccessible(true);
        $property->setValue($this->authService, $this->authDaoMock);

        $daoProperty = $reflection->getParentClass()->getProperty('dao');
        $daoProperty->setAccessible(true);
        $daoProperty->setValue($this->authService, $this->authDaoMock);
    }

    public function testRegisterWithEmptyEmailReturnsFailure(): void
    {
        $result = $this->authService->registerUser([
            'email'    => '',
            'password' => 'secret123',
        ]);

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('required', strtolower($result['error']));
    }

    public function testRegisterWithEmptyPasswordReturnsFailure(): void
    {
        $result = $this->authService->registerUser([
            'email'    => 'test@example.com',
            'password' => '',
        ]);

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('required', strtolower($result['error']));
    }

    public function testRegisterWithDuplicateEmailReturnsFailure(): void
    {
        $this->authDaoMock
            ->method('getUserByEmail')
            ->willReturn(['id' => 1, 'email' => 'existing@example.com']);

        $result = $this->authService->registerUser([
            'email'    => 'existing@example.com',
            'password' => 'secret123',
        ]);

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('already', strtolower($result['error']));
    }

    public function testSuccessfulRegistrationDoesNotExposePassword(): void
    {
        $this->authDaoMock
            ->method('getUserByEmail')
            ->willReturn(false);

        $this->authDaoMock
            ->method('insert')
            ->willReturn(42);

        $this->authDaoMock
            ->method('getById')
            ->willReturn([
                'id'       => 42,
                'email'    => 'new@example.com',
                'password' => 'hashed_value',
                'role'     => 'user',
            ]);

        $result = $this->authService->registerUser([
            'email'    => 'new@example.com',
            'password' => 'secret123',
        ]);

        $this->assertTrue($result['success']);
        $this->assertArrayNotHasKey('password', $result['data']);
    }

    public function testLoginWithMissingCredentialsReturnsFailure(): void
    {
        $result = $this->authService->login(['email' => '', 'password' => '']);

        $this->assertFalse($result['success']);
    }

    public function testLoginWithUnknownEmailReturnsFailure(): void
    {
        $this->authDaoMock
            ->method('getUserByEmail')
            ->willReturn(false);

        $result = $this->authService->login([
            'email'    => 'nobody@example.com',
            'password' => 'secret123',
        ]);

        $this->assertFalse($result['success']);
    }

    public function testLoginWithWrongPasswordReturnsFailure(): void
    {
        $this->authDaoMock
            ->method('getUserByEmail')
            ->willReturn([
                'id'       => 1,
                'email'    => 'user@example.com',
                'password' => password_hash('correctpassword', PASSWORD_BCRYPT),
                'role'     => 'user',
            ]);

        $result = $this->authService->login([
            'email'    => 'user@example.com',
            'password' => 'wrongpassword',
        ]);

        $this->assertFalse($result['success']);
    }
}