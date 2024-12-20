import {
	CreatePostPayload,
	Post,
	Posts,
	UpdatePostPayload,
} from '@/types/posts';
import { fetch } from 'ofetch';

const headers = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
	Origin: '',
	Authorization:
		//TODO: add token
		'Bearer token',
};

export const createPost = async (payload: CreatePostPayload) => {
	const { title, content } = payload;
	const data = await fetch(`http://localhost:8000/api/posts/create_post`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			title,
			content,
		}),
	})
		.then((data) => data.json())
		.catch((error) => console.log(error));

	return data;
};

export const getPosts = async (): Promise<Posts | undefined> => {
	const data = await fetch(`http://localhost:8000/api/posts/get_my_posts`, {
		method: 'GET',
		headers,
	})
		.then((data) => data.json())
		.then((data) => data.posts)
		.catch((error) => console.log(error));

	return data;
};

export const updatePosts = async (payload: UpdatePostPayload) => {
	const { title, content, postId } = payload;
	const data = await fetch(`http://localhost:8000/api/posts/update_post`, {
		method: 'PATCH',
		headers,
		body: JSON.stringify({
			title,
			content,
			post_id: postId,
		}),
	})
		.then((data) => data.json())
		.catch((error) => console.log(error));

	return data;
};
