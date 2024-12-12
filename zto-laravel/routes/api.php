<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\FriendController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('auth:sanctum')->group(function () {

    // Posty
    Route::get('/posts/get_my_posts', [PostController::class, 'get_my_posts']);
    Route::post('/posts/create_post', [PostController::class, 'create_post']);
    Route::delete('/posts/delete_post/{post_id}', [PostController::class, 'delete_post']);
    Route::patch('/posts/update_post', [PostController::class, 'update_post']);

    // Użytkownicy
    Route::get('/auth/signout', [AuthController::class, 'signout']);
    Route::post('/friends/add_friend', [FriendController::class, 'add_friend']);
    Route::get('/friends/get_pending_friend_requests', [FriendController::class, 'get_pending_friend_requests']);
    Route::patch('/friends/manage_friend_request', [FriendController::class, 'manage_friend_request']);
    Route::get('/friends/get_friends', [FriendController::class, 'get_friends']);
});

Route::post('/auth/signup', [AuthController::class, 'signup']);
Route::post('/auth/signin', [AuthController::class, 'signin']);
