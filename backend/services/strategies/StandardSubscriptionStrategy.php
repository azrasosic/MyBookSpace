<?php

declare(strict_types=1);

require_once __DIR__ . '/SubscriptionStatusStrategy.php';

/**
 * StandardSubscriptionStrategy
 *
 * Concrete strategy that classifies a subscription as:
 *   - 'Expired'        — expiration date is in the past (or null)
 *   - 'Expiring Soon'  — expiration date is within the next EXPIRING_SOON_DAYS days
 *   - 'Active'         — expiration date is beyond the threshold
 *
 * To change the "expiring soon" window (e.g. from 7 to 14 days), only this
 * class needs to be updated.
 */
class StandardSubscriptionStrategy implements SubscriptionStatusStrategy
{
    private int $expiringSoonDays;

    public function __construct(int $expiringSoonDays = 7)
    {
        $this->expiringSoonDays = $expiringSoonDays;
    }

    public function calculate(?string $expirationDate): string
    {
        if (!$expirationDate) {
            return 'Expired';
        }

        $today      = new DateTime('today');
        $expiration = new DateTime($expirationDate);

        if ($expiration < $today) {
            return 'Expired';
        }

        $diff = (int) $today->diff($expiration)->days;

        if ($diff <= $this->expiringSoonDays) {
            return 'Expiring Soon';
        }

        return 'Active';
    }
}