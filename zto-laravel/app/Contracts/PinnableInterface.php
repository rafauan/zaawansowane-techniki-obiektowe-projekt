<?php

namespace App\Contracts;

interface PinnableInterface
{
    public function pin(): void;

    public function unpin(): void;

    public function isPinned(): bool;
}
