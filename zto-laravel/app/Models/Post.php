<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends BaseModel
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
     * Metoda do przypinania posta
     */
    public function pin()
    {
        if (!$this->is_pinned) {
            $this->is_pinned = true;
            $this->save();
            $this->logAction('Post pinned');
        }
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
    public function isLikedByUser($userId)
    {
        return $this->likesRelation()->where('user_id', $userId)->exists();
    }
}
