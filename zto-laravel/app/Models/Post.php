<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\BaseModel;
use App\Contracts\LikeableInterface;
use App\Contracts\PinnableInterface;

class Post extends BaseModel implements LikeableInterface, PinnableInterface
{
    use HasFactory;

    // Wypełnialne pola (mass assignment)
    protected $fillable = ['title', 'content', 'user_id', 'likes', 'is_pinned'];

    // Domyślne wartości dla nowych pól
    protected $attributes = [
        'likes' => 0,
        'is_pinned' => false,
    ];

    /**
     * Relacja z modelem User (właściciel posta)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relacja z modelem PostLike (polubienia posta)
     */
    public function likesRelation()
    {
        return $this->hasMany(PostLike::class);
    }

    /**
     * Sprawdzenie, czy post jest polubiony przez użytkownika
     */
    public function isLikedBy(int $userId): bool
    {
        return $this->likesRelation()->where('user_id', $userId)->exists();
    }

    /**
     * Zarządzanie polubieniami: Dodanie polubienia
     */
    public function like(int $userId): bool
    {
        if ($this->isLikedBy($userId)) {
            return false;
        }

        PostLike::create([
            'post_id' => $this->id,
            'user_id' => $userId,
        ]);
        $this->increment('likes');
        return true;
    }

    /**
     * Zarządzanie polubieniami: Usunięcie polubienia
     */
    public function unlike(int $userId): bool
    {
        $like = PostLike::where('post_id', $this->id)->where('user_id', $userId)->first();
        if (!$like) {
            return false;
        }

        $like->delete();
        $this->decrement('likes');
        return true;
    }

    /**
     * Zarządzanie przypinaniem: Przypięcie posta
     */
    public function pin(): void
    {
        if (!$this->is_pinned) {
            $this->is_pinned = true;
            $this->save();
        }
    }

    /**
     * Zarządzanie przypinaniem: Odpięcie posta
     */
    public function unpin(): void
    {
        if ($this->is_pinned) {
            $this->is_pinned = false;
            $this->save();
        }
    }

    /**
     * Sprawdzenie, czy post jest przypięty
     */
    public function isPinned(): bool
    {
        return $this->is_pinned;
    }
}
