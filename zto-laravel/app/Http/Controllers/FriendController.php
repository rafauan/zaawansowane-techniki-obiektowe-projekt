<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Friend;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class FriendController extends Controller
{
    public function add_friend(Request $request)
    {
        $request->validate([
            'friend_id' => 'required|exists:users,id',
        ]);

        $userId = auth()->id();
        $friendId = $request->friend_id;

        if ($userId == $friendId) {
            return response()->json([
                'message' => 'You cannot add yourself as a friend.',
            ], 400);
        }

        // Sprawdzenie, czy relacja już istnieje
        $existingFriendship = Friend::where(function ($query) use ($userId, $friendId) {
            $query->where('user_id', $userId)
                ->where('friend_id', $friendId);
        })->orWhere(function ($query) use ($userId, $friendId) {
            $query->where('user_id', $friendId)
                ->where('friend_id', $userId);
        })->first();

        if ($existingFriendship) {
            return response()->json([
                'message' => 'Friendship request already exists.',
            ], 400);
        }

        // Dodanie znajomego
        $friend = Friend::create([
            'user_id' => $userId,
            'friend_id' => $friendId,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Friend request sent successfully.',
            'friend' => $friend,
        ], 201);
    }

    public function get_pending_friend_requests()
    {
        $userId = auth()->id();

        $pendingRequests = Friend::where('friend_id', $userId)
            ->where('status', 'pending')
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'OK',
            'pending_requests' => $pendingRequests,
        ]);
    }

    public function manage_friend_request(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'id' => 'required|exists:friends,id',
            'user_id' => 'required|exists:users,id',
            'answer' => 'required|boolean',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validate->errors(),
            ], 400);
        }

        $friendship = Friend::where('id', $request->id)
            ->where('friend_id', $request->user()->id)
            ->where('user_id', $request->user_id)
            ->where('status', 'pending')
            ->first();

        if (!$friendship) {
            return response()->json([
                'message' => 'Friend request not found.',
            ], 404);
        }

        if ($request->answer === true) {
            $friendship->status = 'accepted';
            $friendship->save();
        } else if ($request->answer === false) {
            $friendship->status = 'declined';
            $friendship->save();
        }

        return response()->json([
            'message' => 'Friend request updated successfully.',
            'answer' => $request->answer,
            'friendship' => $friendship,
        ]);
    }

    public function get_friends()
    {
        $user_id = auth()->id();

        $friends = Friend::where('user_id', $user_id)
            ->where('status', 'accepted')
            ->with('friend')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'message' => 'OK',
            'friends' => $friends,
        ]);
    }

    public function search_users(Request $request)
    {
        $search = $request->query('search');

        $users = User::where('first_name', 'LIKE', "%$search%")
            ->orWhere('last_name', 'LIKE', "%$search%")
            ->orderBy('first_name')
            ->get(['id', 'first_name', 'last_name']);

        if ($users->isEmpty()) {
            return response()->json(['message' => 'No users found'], 404);
        }

        return response()->json(['users' => $users], 200);
    }
}

