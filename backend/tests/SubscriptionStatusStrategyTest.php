<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../services/strategies/SubscriptionStatusStrategy.php';
require_once __DIR__ . '/../services/strategies/StandardSubscriptionStrategy.php';

/**
 * Tests for StandardSubscriptionStrategy (Strategy Pattern).
 *
 * These tests verify that subscription status is calculated correctly
 * based on expiration date and the configured 'expiring soon' threshold.
 * No database or DAO is required.
 */
class SubscriptionStatusStrategyTest extends TestCase
{
    private StandardSubscriptionStrategy $strategy;

    protected function setUp(): void
    {
        $this->strategy = new StandardSubscriptionStrategy(7);
    }

    public function testNullExpirationDateReturnsExpired(): void
    {
        $result = $this->strategy->calculate(null);
        $this->assertSame('Expired', $result);
    }

    public function testPastDateReturnsExpired(): void
    {
        $pastDate = (new DateTime('-30 days'))->format('Y-m-d');
        $result = $this->strategy->calculate($pastDate);
        $this->assertSame('Expired', $result);
    }

    public function testYesterdayReturnsExpired(): void
    {
        $yesterday = (new DateTime('-1 day'))->format('Y-m-d');
        $result = $this->strategy->calculate($yesterday);
        $this->assertSame('Expired', $result);
    }

    public function testDateOnThresholdBoundaryReturnsExpiringSoon(): void
    {
        $boundary = (new DateTime('+7 days'))->format('Y-m-d');
        $result = $this->strategy->calculate($boundary);
        $this->assertSame('Expiring Soon', $result);
    }

    public function testDateWithinThresholdReturnsExpiringSoon(): void
    {
        $soonDate = (new DateTime('+3 days'))->format('Y-m-d');
        $result = $this->strategy->calculate($soonDate);
        $this->assertSame('Expiring Soon', $result);
    }

    public function testDateBeyondThresholdReturnsActive(): void
    {
        $futureDate = (new DateTime('+30 days'))->format('Y-m-d');
        $result = $this->strategy->calculate($futureDate);
        $this->assertSame('Active', $result);
    }

    public function testFarFutureDateReturnsActive(): void
    {
        $farFuture = (new DateTime('+2 years'))->format('Y-m-d');
        $result = $this->strategy->calculate($farFuture);
        $this->assertSame('Active', $result);
    }

    public function testCustomThresholdIsApplied(): void
    {
        $strategy14 = new StandardSubscriptionStrategy(14);

        $in10Days = (new DateTime('+10 days'))->format('Y-m-d');

        $this->assertSame('Active', $this->strategy->calculate($in10Days));

        $this->assertSame('Expiring Soon', $strategy14->calculate($in10Days));
    }
}