'use client';

import { API } from '@/api/API';
import LoadSpinner from '@/components/LoadSpinner';
import { IPost } from '@/types/posts';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page() {
	const [posts, setPosts] = useState<IPost[]>([]);
	const [loading, setLoading] = useState(true);

	const [likedPosts, setLikedPosts] = useState<Array<number>>([]);

	useEffect(() => {
		getData();
	}, []);

	const getData = async () => {
		try {
			let allPosts: IPost[] = [];

			const myPostsResponse = await API.GET.myPosts();
			allPosts = myPostsResponse.posts;

			const getFriendsResponse = await API.GET.friends();
			if (getFriendsResponse.friends.length) {
				const friendsPostsResponse = await API.GET.friendsPosts();
				allPosts = allPosts.concat(friendsPostsResponse.posts);
			}

			setPosts(allPosts);
			setLoading(false);
		} catch {
			setPosts([]);
			setLoading(false);
		}
	};

	const handleLike = async (postId: number) => {
		const res = await API.POST.likePost(postId);
		if (res) {
			getData();
			setLikedPosts([...likedPosts, postId]);
		}
	};

	const handleUnlike = async (postId: number) => {
		const res = await API.POST.unlikePost(postId);
		if (res) {
			getData();
			setLikedPosts(likedPosts.filter((post) => post !== postId));
		}
	};

	const handleTogglePost = async (postId: number) => {
		const res = await API.POST.togglePostPin(postId);
		if (res) {
			getData();
		}
	};

	const sortedPosts = [...posts].sort(
		(a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0)
	);

	const handleDeletePost = async (postId: number) => {
		const res = await API.DELETE.post(postId);
		if (res) getData();
	};

	if (loading)
		return (
			<div className='h-full w-2/3 ml-[50%] mt-20 '>
				<LoadSpinner />
			</div>
		);
	return posts.length ? (
		<div className='bg-gray-100 min-h-screen p-8 flex flex-col'>
			<Link className='self-end' href={'/posts/create'}>
				<button className='bg-blue-200 self-end	py-2 px-4 rounded'>
					Utwórz nowy post
				</button>
			</Link>
			<div className='flex flex-col items-center space-y-4'>
				{sortedPosts.map((post) => (
					<div
						key={post.id}
						className='relative w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-sm p-4'
					>
						{post.is_pinned ? (
							<div className='absolute top-2 right-2 text-gray-600 text-sm'>
								📌
							</div>
						) : null}

						<div className='flex items-center mb-3'>
							<div className='w-10 h-10 bg-gray-300 rounded-full mr-3'></div>
							<div className='flex flex-col'>
								<span className='font-medium text-black leading-tight'>
									User name
								</span>
								<span className='text-xs text-gray-500'>
									{new Date(post.created_at).toDateString()}
								</span>
							</div>
						</div>

						<h2 className='text-lg font-semibold text-gray-900 mb-1'>
							{post.title}
						</h2>
						<div className='text-base text-gray-800 mb-3'>{post.content}</div>

						{post.updated_at !== post.created_at && (
							<div className='text-xs text-gray-500 mb-3'>
								Zaktualizowano:{' '}
								{new Date(post.updated_at).toLocaleDateString('pl', {
									day: '2-digit',
									month: 'short',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
								})}
							</div>
						)}

						<div className='flex items-center justify-start text-sm text-gray-500 gap-2 mb-5'>
							<span>Lubi to: {post.likes}</span>
							<button
								onClick={() =>
									likedPosts.includes(post.id)
										? handleUnlike(post.id)
										: handleLike(post.id)
								}
								className={`px-2 py-1 rounded text-xs bg-blue-600 text-white hover:bg-blue-700`}
							>
								{likedPosts.includes(post.id) ? 'Usuń polubienie' : 'Lubię to'}
							</button>
						</div>
						<div className='text-sm text-gray-500 flex justify-start gap-4'>
							<Link href={`/posts/${post.id}/edit`} className='text-blue-600'>
								<button>Edytuj post ✏️</button>
							</Link>
							<p>|</p>
							<button
								className='text-blue-600'
								onClick={() => handleTogglePost(post.id)}
							>
								{post.is_pinned ? 'Odepnij post' : 'Przypnij post'}
							</button>
							<p>|</p>
							<button
								className={`px-2 py-1 rounded text-xs bg-red-800 text-white `}
								onClick={() => handleDeletePost(post.id)}
							>
								Usuń
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	) : (
		<div className='h-full w-2/3 mx-auto mt-20 flex flex-col gap-2 items-center'>
			<p className='text-center font-semibold text-gray-700'>
				Ty i Twoi znajomi jeszcze nie dodaliście żadnych postów. Bądź pierwszy i
				zacznij coś nowego!
			</p>
			<Link href='/posts/create' className='text-blue-600 font-semibold'>
				Dodaj pierwszy post
			</Link>
		</div>
	);
}
