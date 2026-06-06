<?php

declare(strict_types=1);

interface SubscriptionStatusStrategy
{
    public function calculate(?string $expirationDate): string;
}