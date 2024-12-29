<?php

namespace App\Contracts;

interface LikeableInterface
{
    public function like(int $userId): bool;

    public function unlike(int $userId): bool;

    public function isLikedBy(int $userId): bool;
}
