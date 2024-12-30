<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function add_comment(Request $request)
    {
        try {
            $request->validate([
                'content' => 'required|string',
                'post_id' => 'required|exists:posts,id',
            ]);

            $comment = Comment::create([
                'post_id' => $request->post_id,
                'user_id' => auth()->id(),
                'content' => $request->content,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment,
        ], 201);
    }

    public function delete_comment($comment_id)
    {
        try {
            // Pobranie komentarza za pomocą metody BaseModel
            $comment = Comment::getRecord($comment_id);
    
            // Sprawdzenie, czy zalogowany użytkownik ma prawo usunąć komentarz
            if ($comment->user_id !== auth()->id() && $comment->post->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized to delete this comment'], 403);
            }
    
            // Usunięcie komentarza
            Comment::deleteRecord($comment_id);
    
            return response()->json(['message' => 'Comment deleted successfully'], 200);
        } catch (\Exception $e) {
            // Obsługa błędów
            if ($e->getMessage() === 'Record not found') {
                return response()->json(['message' => 'Comment not found'], 404);
            }
    
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 400);
        }
    }
}
