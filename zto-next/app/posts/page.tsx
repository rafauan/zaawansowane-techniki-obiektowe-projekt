"use client";
import React, { useEffect, useState } from "react";

export default function Page() {
  const posts = [
    {
      id: 2,
      likes: 3,
      is_pinned: false,
      user_id: 3,
      user_name: 'Jan Kowalski',
      title: 'Pierwszy post',
      content: 'Hej! Hej!',
      created_at: '2 godziny temu',
      updated_at: '2 godziny temu'
    },
    {
      id: 3,
      likes: 5,
      is_pinned: false,
      user_id: 7,
      user_name: 'Anna Nowak',
      title: 'Drugi post testowy',
      content: 'Siemano, to drugi testowy post.',
      created_at: '2 godziny temu',
      updated_at: '1 godzinę temu'
    },
    {
      id: 8,
      likes: 4,
      is_pinned: true,
      user_id: 8,
      user_name: 'Marian Paździoch',
      title: 'Zawiadomienie',
      content: 'Panie Boczek, Pan wiesz już co.',
      created_at: '2 minuty temu',
      updated_at: '1 minutę temu'
    }
  ];

  const [likesState, setLikesState] = useState(posts.map(p => p.likes));
  const [likedPosts, setLikedPosts] = useState(posts.map(() => false));

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

  const sortedPosts = [...posts].sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="flex flex-col items-center space-y-4">
        {sortedPosts.map((post, index) => (
          <div
            key={post.id}
            className="relative w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-sm p-4"
          >
            {post.is_pinned && (
              <div className="absolute top-2 right-2 text-gray-600 text-sm">
                📌
              </div>
            )}

            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div className="flex flex-col">
                <span className="font-medium text-black leading-tight">{post.user_name}</span>
                <span className="text-xs text-gray-500">{post.created_at}</span>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h2>
            <div className="text-base text-gray-800 mb-3">
              {post.content}
            </div>

            {post.updated_at !== post.created_at && (
              <div className="text-xs text-gray-500 mb-3">Zaktualizowano: {post.updated_at}</div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span>Lubi to: {likesState[index]}</span>
                <button
                  onClick={() => handleLike(index)}
                  className={`px-2 py-1 rounded text-xs ${
                    likedPosts[index]
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={likedPosts[index]}
                >
                  Lubię to!
                </button>
              </div>
              <a
                href={`http://localhost:3000/${post.id}/edit`}
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
  );
}