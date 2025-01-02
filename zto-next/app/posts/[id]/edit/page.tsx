"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PostForm from "../../PostForm";
import { IPost } from "@/types/posts";
import { API } from "@/api/API";

const EditPost = () => {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPost();
  }, []);

  const getPost = async () => {
    try {
      const myPostsResponse = await API.GET.myPosts();
      const post = myPostsResponse.posts.find(
        (el) => typeof id === "string" && el.id.toString() === id
      );
      if (post) setPost(post);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!post) return;
      const res = await API.PATCH.post({
        title: post.title,
        content: post.content,
        post_id: post.id,
      });
      if (res) router.replace("/posts");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="h-full w-2/3 mx-auto mt-20">
        <p className="text-center font-semibold text-gray-700">
          Loading post...
        </p>
      </div>
    );

  return post ? (
    <PostForm
      pageTitle="Edytuj post"
      titleValue={post.title}
      contentValue={post.content}
      onChangeContent={(text) => setPost({ ...post, content: text })}
      onChangeTitle={(text) => setPost({ ...post, title: text })}
      handleSubmit={handleSubmit}
    />
  ) : (
    <div className="h-full w-2/3 mx-auto mt-20">
      <p className="text-center font-semibold text-gray-700">Error</p>
    </div>
  );
};

export default EditPost;
