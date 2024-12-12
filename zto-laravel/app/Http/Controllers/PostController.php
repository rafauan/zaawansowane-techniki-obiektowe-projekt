<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;

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
        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 400);
        }

        $post = Post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Post created successfully',
            'post' => $post,
        ], 201);
    }

    public function delete_post($post_id)
    {
        if (!$post_id) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => ['post_id' => 'Post ID is required'],
            ], 400);
        }

        $post = Post::find($post_id);

        if (!$post) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }

        $post->delete();

        return response()->json([
            'message' => 'Post deleted successfully',
        ]);
    }

    public function update_post(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'nullable|string',
            'content' => 'nullable|string',
            'post_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 400);
        }

        $post = Post::find($request->post_id);

        if (!$post) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }

        $post->title = $request->title;
        $post->content = $request->content;
        $post->save();

        return response()->json([
            'message' => 'Post updated successfully',
            'post' => $post,
        ]);
    }
}
