'use client';

import { createPost } from '@/data/posts';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PostForm from '../PostForm';

const CreatePost = () => {
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const handleSubmit = async () => {
		const data = await createPost({ title, content });
		if (data) router.replace('/posts');
	};

	return (
		<PostForm
			pageTitle='Create post'
			titleValue={title}
			contentValue={content}
			onChangeContent={setContent}
			onChangeTitle={setTitle}
			handleSubmit={handleSubmit}
		/>
	);
};

export default CreatePost;
