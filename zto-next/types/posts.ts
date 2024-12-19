interface Post {
	id: number;
	likes: number;
	is_pinned: boolean;
	user_id: number;
	content: string;
	title: string;
	updated_at: string;
	created_at: string;
}

type Posts = Post[];

type PostsResponse = {
	message: string;
	posts: Posts;
};

type CreatePostPayload = {
	title: string;
	content: string;
};

type UpdatePostPayload = {
	title: string;
	content: string;
	postId: number;
};

export type {
	Post,
	Posts,
	PostsResponse,
	CreatePostPayload,
	UpdatePostPayload,
};
