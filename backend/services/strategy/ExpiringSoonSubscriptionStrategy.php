<?php

declare(strict_types=1);

require_once 'SubscriptionStatusStrategy.php';

class ExpiringSoonSubscriptionStrategy implements SubscriptionStatusStrategy
{
    public function calculate(?string $expirationDate): string
    {
        return 'Expiring Soon';
    }
}