<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => auth()->id(),
            'receiver_id' => $validated['receiver_id'],
            'content' => $validated['content'],
        ]);

        return response()->json($message, 201);
    }

    public function getMessages(Request $request)
    {
        $messages = Message::where('sender_id', auth()->id())
            ->orWhere('receiver_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($messages, 200);
    }

    public function markAsRead($id)
    {
        $message = Message::where('id', $id)
            ->where('receiver_id', auth()->id())
            ->firstOrFail();

        $message->update(['is_read' => true]);

        return response()->json(['message' => 'Marked as read'], 200);
    }

    public function deleteMessage($id)
    {
        $message = Message::where('id', $id)
            ->where(function ($query) {
                $query->where('sender_id', auth()->id())
                    ->orWhere('receiver_id', auth()->id());
            })
            ->firstOrFail();

        $message->delete();

        return response()->json(['message' => 'Deleted'], 200);
    }
}
