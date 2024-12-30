<?php

use App\Http\Controllers\MessageController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FriendController;
use App\Http\Controllers\CommentController;

Route::middleware('auth:sanctum')->group(function () {

    // Posty
    Route::get('/posts/get_my_posts', [PostController::class, 'get_my_posts']);
    Route::post('/posts/create_post', [PostController::class, 'create_post']);
    Route::delete('/posts/delete_post/{post_id}', [PostController::class, 'delete_post']);
    Route::patch('/posts/update_post', [PostController::class, 'update_post']);
    Route::post('/posts/{post_id}/like', [PostController::class, 'like_post']);
    Route::post('/posts/{post_id}/unlike', [PostController::class, 'unlike_post']);
    Route::post('/posts/{post_id}/toggle_pin', [PostController::class, 'toggle_post_pin']);
    Route::get('/posts/get_friends_posts', [PostController::class, 'get_friends_posts']);

    // Komentarze
    Route::post('/posts/add_comment', [CommentController::class, 'add_comment']);
    Route::delete('/posts/delete_comment/{comment_id}', [CommentController::class, 'delete_comment']);

    // Użytkownicy
    Route::get('/auth/signout', [AuthController::class, 'signout']);
    Route::post('/friends/add_friend', [FriendController::class, 'add_friend']);
    Route::get('/friends/get_pending_friend_requests', [FriendController::class, 'get_pending_friend_requests']);
    Route::patch('/friends/manage_friend_request', [FriendController::class, 'manage_friend_request']);
    Route::get('/friends/get_friends', [FriendController::class, 'get_friends']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/friends/search', [FriendController::class, 'search_users']);

    // Wiadomości
    Route::post('/messages', [MessageController::class, 'sendMessage']);
    Route::get('/messages', [MessageController::class, 'getMessages']);
    Route::patch('/messages/{id}/read', [MessageController::class, 'markAsRead']);
    Route::delete('/messages/{id}', [MessageController::class, 'deleteMessage']);
});

Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::post('/auth/signin', [AuthController::class, 'signin']);
