<?php

namespace App\Models;

use App\Models\BaseModel;

class Comment extends BaseModel
{
    protected $fillable = ['post_id', 'user_id', 'content'];

    /**
     * Relacja z modelem Post
     */
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    /**
     * Relacja z modelem User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
