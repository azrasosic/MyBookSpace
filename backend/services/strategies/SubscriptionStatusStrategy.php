<?php

declare(strict_types=1);

/**
 * SubscriptionStatusStrategy Interface
 *
 * Defines the contract for all subscription status calculation strategies.
 * Implementing the Strategy Pattern allows business rules to be changed in 
 * one place without touching any other code.
 */
interface SubscriptionStatusStrategy
{
    /**
     * Calculate and return the subscription status string for a given
     * expiration date.
     *
     * @param string|null $expirationDate  ISO date string (Y-m-d) or null
     * @return string  One of: 'Active', 'Expiring Soon', 'Expired'
     */
    public function calculate(?string $expirationDate): string;
}