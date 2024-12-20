'use client';

import { getPosts, updatePosts } from '@/data/posts';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostForm from '../../PostForm';
import { Post } from '@/types/posts';

const EditPost = () => {
	const router = useRouter();
	const { id } = useParams();
	const [post, setPost] = useState<Post | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getPosts().then((data) => {
			const post = data?.find(
				(el) => typeof id === 'string' && el.id.toString() === id
			);
			if (post) {
				setPost(post);
			}
			setLoading(false);
		});
	}, []);

	const handleSubmit = async () => {
		const data =
			post &&
			(await updatePosts({
				title: post.title,
				content: post.content,
				postId: post.id,
			}));
		if (data) router.replace('/posts');
	};

	if (loading)
		return (
			<div className='h-full w-2/3 mx-auto mt-20'>
				<p className='text-center font-semibold text-gray-700'>
					Loading post...
				</p>
			</div>
		);

	return post ? (
		<PostForm
			pageTitle='Edytuj post'
			titleValue={post.title}
			contentValue={post.content}
			onChangeContent={(text) => setPost({ ...post, content: text })}
			onChangeTitle={(text) => setPost({ ...post, title: text })}
			handleSubmit={handleSubmit}
		/>
	) : (
		<div className='h-full w-2/3 mx-auto mt-20'>
			<p className='text-center font-semibold text-gray-700'>Error</p>
		</div>
	);
};

export default EditPost;
