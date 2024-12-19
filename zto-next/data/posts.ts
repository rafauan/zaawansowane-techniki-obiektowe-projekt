import { CreatePostPayload } from '@/types/posts';
import { fetch } from 'ofetch';

export const createPost = async (payload: CreatePostPayload) => {
	const { title, content } = payload;
	const data = await fetch(`http://localhost:8000/api/posts/create_post`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Origin: '',
			Host: 'http://localhost:8000/api',
			Authorization:
				//TODO: add token
				'Bearer token',
		},
		body: JSON.stringify({
			title,
			content,
		}),
	})
		.then((data) => data.json())
		.catch((error) => console.log(error));

	return data;
};
