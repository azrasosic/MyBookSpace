<?php

declare(strict_types=1);

require_once __DIR__ . '/SubscriptionStatusStrategy.php';
require_once __DIR__ . '/ActiveSubscriptionStrategy.php';
require_once __DIR__ . '/ExpiringSoonSubscriptionStrategy.php';
require_once __DIR__ . '/ExpiredSubscriptionStrategy.php';

class SubscriptionStatusContext
{
    private SubscriptionStatusStrategy $strategy;

    public function resolveStatus(?string $expirationDate): string
    {
        if (!$expirationDate) {
            $this->strategy = new ExpiredSubscriptionStrategy();
            return $this->strategy->calculate($expirationDate);
        }

        $today    = new DateTime();
        $expiry   = new DateTime($expirationDate);
        $daysLeft = (int) $today->diff($expiry)->format('%r%a');

        if ($daysLeft < 0) {
            $this->strategy = new ExpiredSubscriptionStrategy();
        } elseif ($daysLeft <= 7) {
            $this->strategy = new ExpiringSoonSubscriptionStrategy();
        } else {
            $this->strategy = new ActiveSubscriptionStrategy();
        }

        return $this->strategy->calculate($expirationDate);
    }
}