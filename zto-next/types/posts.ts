export interface IPost {
  id: number;
  likes: number;
  is_pinned: boolean;
  user_id: number;
  content: string;
  title: string;
  updated_at: string;
  created_at: string;
}

export interface CreatePostResponse {
  message: string;
  post: IPost;
}

export interface UpdatePostResponse {
  id: number;
  title: string;
  content: string;
  updatedAt: string;
}

export interface GetPostsResponse {
  message: string;
  posts: IPost[];
}

export interface DeletePostResponse {
  message: string;
}

//Payloads
export type CreatePostPayload = {
  title: string;
  content: string;
};

export type UpdatePostPayload = {
  title: string;
  content: string;
  postId: number;
};
