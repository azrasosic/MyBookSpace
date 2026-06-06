<?php

declare(strict_types=1);

require_once 'SubscriptionStatusStrategy.php';

class ActiveSubscriptionStrategy implements SubscriptionStatusStrategy
{
    public function calculate(?string $expirationDate): string
    {
        return 'Active';
    }
}