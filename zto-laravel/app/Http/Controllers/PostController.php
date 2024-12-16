<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;
use App\Models\PostLike;

class PostController extends Controller
{
    public function get_my_posts()
    {
        $posts = Post::where('user_id', auth()->user()->id)->orderBy('created_at', 'desc')->get();
        
        if ($posts->isEmpty()) {
            return response()->json([
                'message' => 'No posts found',
            ], 404);
        }

        return response()->json([
            'message' => 'OK',
            'posts' => $posts,
        ]);
	}

    public function create_post(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'content' => 'required|string|max:1000',
                'title' => 'required|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            $post = Post::create([
                'user_id' => auth()->id(),
                'content' => $request->content,
                'title' => $request->title,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post,
        ], 201);
    }

    public function get_record($post_id)
    {
        try {
            $post = Post::getRecord($post_id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }

        return response()->json([
            'message' => 'OK',
            'post' => $post,
        ]);
    }

    public function update_post(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'content' => 'required|string|max:1000',
                'title' => 'required|string|max:255',
                'post_id' => 'required|integer',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            $post = Post::updateRecord($request->post_id, $request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post,
        ]);
    }

    public function delete_post($post_id)
    {
        try {
            Post::deleteRecord($post_id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }

        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }

    public function like_post($post_id)
    {
        $post = Post::find($post_id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $user_id = auth()->id();

        // Sprawdzenie, czy użytkownik już polubił ten post
        if ($post->isLikedByUser($user_id)) {
            return response()->json(['message' => 'You have already liked this post'], 400);
        }
    
        // Dodanie rekordu do tabeli post_likes
        PostLike::create([
            'post_id' => $post_id,
            'user_id' => $user_id,
        ]);

        // Opcjonalnie zwiększ licznik polubień
        $post->increment('likes');
        $post->logAction('Post liked');

        return response()->json([
            'message' => 'Post liked successfully',
            'likes' => $post->likes,
        ]);
    }
}
