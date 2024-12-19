'use client';

import { getPosts } from '@/data/posts';
import { Posts } from '@/types/posts';
import { useEffect, useState } from 'react';

export default function Page() {
	const [posts, setPosts] = useState<Posts>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getPosts().then((data) => {
			if (data) setPosts(data);
			setLoading(false);
		});
	}, []);

	if (loading)
		return (
			<div className='h-full w-2/3 mx-auto mt-20'>
				<p className='text-center font-semibold text-gray-700'>
					Loading posts...
				</p>
			</div>
		);
	return (
		<div>
			<h1 className='text-3xl font-bold underline'>Posts</h1>
			<div>
				{posts?.map((el) => (
					<p key={el.id}>{el.title}</p>
				))}
			</div>
		</div>
	);
}
