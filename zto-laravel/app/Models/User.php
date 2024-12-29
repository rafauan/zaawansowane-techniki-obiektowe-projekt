<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function friends()
    {
        return $this->hasMany(Friend::class, 'user_id')
            ->where('status', 'accepted'); // Znajomi, gdzie user_id
    }
    
    public function friendOf()
    {
        return $this->hasMany(Friend::class, 'friend_id')
            ->where('status', 'accepted'); // Znajomi, gdzie friend_id
    }
    
    public function acceptedFriends()
    {
        $friendIds = $this->friends()->pluck('friend_id'); // Znajomi, gdzie user_id = auth()->id()
        $friendOfIds = $this->friendOf()->pluck('user_id'); // Znajomi, gdzie friend_id = auth()->id()

        // Połącz listy ID i zwróć użytkowników
        return User::whereIn('id', $friendIds->merge($friendOfIds))->get();
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

}
