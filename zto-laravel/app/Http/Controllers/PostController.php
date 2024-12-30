<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;

class PostController extends Controller
{
    public function get_my_posts()
    {
        $posts = Post::where('user_id', auth()->user()->id)
            ->orderBy('created_at', 'desc')
            ->with([
                'comments' => function ($query) {
                    $query->with('user:id,first_name,last_name') // Pobiera dane autora komentarza
                          ->orderBy('created_at', 'asc'); // Sortowanie komentarzy
                }
            ])
            ->get();
    
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
                'image' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()->first()], 400);
            }

            $image_path = null;

            if ($request->hasFile('image')) {
                try {
                    $image_path = $request->file('image')->store('images/posts', 'public');
                } catch (\Exception $e) {
                    return response()->json(['message' => 'Error saving image: ' . $e->getMessage()], 500);
                }
            }

            $post = Post::create([
                'title' => $request->title,
                'content' => $request->content,
                'user_id' => auth()->id(),
                'image_path' => $image_path,
            ]);
    
            // Dodanie pełnego URL obrazu do odpowiedzi
            $post->image_url = $image_path ? asset('storage/' . $image_path) : null;
    
            return response()->json([
                'message' => 'Post created successfully',
                'post' => $post,
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()], 500);
        }
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

    public function like_post(int $post_id)
    {
        try {
            $post = Post::getRecord($post_id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
        $user_id = auth()->id();

        if ($post->like($user_id)) {
            return response()->json([
                'message' => 'Post liked successfully',
                'likes' => $post->likes,
            ], 200);
        }
    
        return response()->json([
            'message' => 'You have already liked this post',
        ], 400);
    }

    public function unlike_post(int $post_id)
    {
        try {
            $post = Post::getRecord($post_id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }
        $user_id = auth()->id();

        if ($post->unlike($user_id)) {
            return response()->json([
                'message' => 'Post unliked successfully',
                'likes' => $post->likes,
            ], 200);
        }

        return response()->json([
            'message' => 'You have not liked this post yet',
        ], 400);
    }

    public function toggle_post_pin(int $post_id)
    {
        try {
            $post = Post::getRecord($post_id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 404);
        }

        // Przełącz stan przypięcia
        if ($post->isPinned()) {
            $post->unpin();
            return response()->json([
                'message' => 'Post unpinned successfully',
            ], 200);
        } else {
            $post->pin();
            return response()->json([
                'message' => 'Post pinned successfully',
            ], 200);
        }
    }

    public function get_friends_posts()
    {
        $user = auth()->user();

        $friend_ids = $user->acceptedFriends()->pluck('id');

        // Pobierz posty zaakceptowanych znajomych
        $posts = Post::whereIn('user_id', $friend_ids)
            ->orderBy('created_at', 'desc')
            ->with('user:id,first_name,last_name')
            ->with([
                'comments' => function ($query) {
                    $query->with('user:id,first_name,last_name')
                          ->orderBy('created_at', 'asc');
                }
            ])
            ->get();

        if ($posts->isEmpty()) {
            return response()->json([
                'message' => 'No posts found from your accepted friends',
            ], 404);
        }

        return response()->json([
            'message' => 'Posts retrieved successfully',
            'posts' => $posts,
        ], 200);
    }

}
