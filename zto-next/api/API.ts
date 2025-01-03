import { ofetch, IFetchError } from 'ofetch';
import { toast } from 'react-toastify';
import { useAppStore } from '@/store/store';

import {
	IUser,
	SignUpResponse,
	SignInResponse,
	SearchUsersResponse,
} from '@/types/user';

import {
	CreatePostResponse,
	UpdatePostResponse,
	GetPostsResponse,
	DeletePostResponse,
	LikePostResponse,
	TogglePostResponse,
} from '@/types/posts';
import {
	GetFriendsResponse,
	GetPendingFriendRequestsResponse,
	AddFriendResponse,
	ManageFriendRequestResponse,
} from '@/types/friends';

const _ofetch = ofetch.create({ baseURL: 'http://localhost:8000/api' });

// middleware to hanle error toasts globally
const oFetch = async <ResponseT>(
	url: string,
	options: RequestInit,
	hideToast: boolean = false
) => {
	try {
		const res = await _ofetch<ResponseT, 'json'>(url, {
			...options,
			parseResponse: JSON.parse,
		});
		console.log({ url, res });
		return res;
	} catch (error: any) {
		console.error(error);
		if (!hideToast) toast.error(`Error: ${error.data.message}`);
		//TODO: extend and figure out how to handle error types better
		throw error as IFetchError<{ message: string }>;
	}
};

// auto include token from the store persisted in local storage
const headers = () => {
	const token = useAppStore.getState().token;
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		Origin: '',
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	};
};

const GET = {
	user() {
		return oFetch<IUser>(`/user`, {
			method: 'GET',
			headers: headers(),
		});
	},
	myPosts() {
		return oFetch<GetPostsResponse>(`/posts/get_my_posts`, {
			method: 'GET',
			headers: headers(),
		});
	},
	friendsPosts() {
		return oFetch<GetPostsResponse>(`/posts/get_friends_posts`, {
			method: 'GET',
			headers: headers(),
		});
	},
	signOut() {
		return oFetch(`/auth/signout`, {
			method: 'GET',
			headers: headers(),
		});
	},
	searchUsers(query: string) {
		return oFetch<SearchUsersResponse>(`/friends/search`, {
			method: 'GET',
			headers: headers(),
		});
	},
	pendingFriendRequests() {
		return oFetch<GetPendingFriendRequestsResponse>(
			`/friends/get_pending_friend_requests`,
			{
				method: 'GET',
				headers: headers(),
			}
		);
	},
	friends() {
		return oFetch<GetFriendsResponse>(`/friends/get_friends`, {
			method: 'GET',
			headers: headers(),
		});
	},
};

const POST = {
	async signUp(data: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	}) {
		return oFetch<SignUpResponse>(`/auth/signup`, {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify(data),
		});
	},
	signIn(data: { email: string; password: string }) {
		return oFetch<SignInResponse>(`/auth/signin`, {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify(data),
		});
	},
	createPost(data: { title: string; content: string; image?: string | null }) {
		return oFetch<CreatePostResponse>(`/posts/create_post`, {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify({ ...data, image: data.image ?? null }),
		});
	},
	likePost(postId: number) {
		return oFetch<LikePostResponse>(`/posts/${postId}/like`, {
			method: 'POST',
			headers: headers(),
		});
	},
	unlikePost(postId: number) {
		return oFetch<LikePostResponse>(`/posts/${postId}/unlike`, {
			method: 'POST',
			headers: headers(),
		});
	},
	togglePostPin(postId: number) {
		return oFetch<TogglePostResponse>(`/posts/${postId}/toggle_pin`, {
			method: 'POST',
			headers: headers(),
		});
	},
	addFriend(friendId: number) {
		return oFetch<AddFriendResponse>(`/friends/add_friend`, {
			method: 'POST',
			headers: headers(),
			body: JSON.stringify({ friend_id: friendId }),
		});
	},
};

const PATCH = {
	post(data: { title: string; content: string; post_id: number }) {
		return oFetch<UpdatePostResponse>(`/posts/update_post`, {
			method: 'PATCH',
			headers: headers(),
			body: JSON.stringify(data),
		});
	},
	friendRequest(data: { user_id: number; id: number; answer: boolean }) {
		return oFetch<ManageFriendRequestResponse>(
			`/friends/manage_friend_request`,
			{
				method: 'PATCH',
				headers: headers(),
				body: JSON.stringify(data),
			}
		);
	},
};

const DELETE = {
	post(postId: number) {
		return oFetch<DeletePostResponse>(`/posts/delete_post/${postId}`, {
			method: 'DELETE',
			headers: headers(),
		});
	},
};

export const API = {
	GET,
	POST,
	PATCH,
	DELETE,
};
``;
