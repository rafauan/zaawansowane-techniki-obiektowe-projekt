"use client";

import { getPosts } from "@/data/posts";
import { IPost } from "@/types/posts";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [likesState, setLikesState] = useState(posts.map((p) => p.likes));
  const [likedPosts, setLikedPosts] = useState(posts.map(() => false));

  useEffect(() => {
    getPosts().then((data) => {
      if (data) setPosts(data);
      setLoading(false);
    });
  }, []);

  const handleLike = (index: number) => {
    if (!likedPosts[index]) {
      setLikesState((prev) => {
        const newLikes = [...prev];
        newLikes[index] = newLikes[index] + 1;
        return newLikes;
      });
      setLikedPosts((prev) => {
        const newLiked = [...prev];
        newLiked[index] = true;
        return newLiked;
      });
    }
  };

  const sortedPosts = [...posts].sort(
    (a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0)
  );

  if (loading)
    return (
      <div className="h-full w-2/3 mx-auto mt-20">
        <p className="text-center font-semibold text-gray-700">
          Loading posts...
        </p>
      </div>
    );
  return posts.length ? (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col">
      <Link className="self-end" href={"/posts/create"}>
        <button className="bg-blue-200 self-end	py-2 px-4 rounded">
          Utwórz nowy post
        </button>
      </Link>
      <div className="flex flex-col items-center space-y-4">
        {sortedPosts.map((post, index) => (
          <div
            key={post.id}
            className="relative w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-sm p-4"
          >
            {post.is_pinned ? (
              <div className="absolute top-2 right-2 text-gray-600 text-sm">
                📌
              </div>
            ) : null}

            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div className="flex flex-col">
                <span className="font-medium text-black leading-tight">
                  User name
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.created_at).toDateString()}
                </span>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {post.title}
            </h2>
            <div className="text-base text-gray-800 mb-3">{post.content}</div>

            {post.updated_at !== post.created_at && (
              <div className="text-xs text-gray-500 mb-3">
                Zaktualizowano:{" "}
                {new Date(post.updated_at).toLocaleDateString("pl", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span>Lubi to: {likesState[index]}</span>
                <button
                  onClick={() => handleLike(index)}
                  className={`px-2 py-1 rounded text-xs ${
                    likedPosts[index]
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  disabled={likedPosts[index]}
                >
                  Lubię to!
                </button>
              </div>
              <a
                href={`http://localhost:3000/posts/${post.id}/edit`}
                className="cursor-pointer hover:text-gray-700"
                title="Edytuj post"
              >
                Edytuj post ✏️
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="h-full w-2/3 mx-auto mt-20">
      <p className="text-center font-semibold text-gray-700">
        Nie posiadasz postów{" "}
        <Link href="/posts/create" className="text-blue-600">
          Utwórz nowy
        </Link>
      </p>
    </div>
  );
}
