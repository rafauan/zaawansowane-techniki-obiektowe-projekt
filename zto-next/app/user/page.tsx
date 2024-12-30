"use client";

import { useEffect, useState } from "react";
import { API } from "@/api/API";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/store";
import { IPost } from "@/types/posts";
import LoadSpinner from "@/components/LoadSpinner";
import { IUser } from "@/types/user";
import { IFriend } from "@/types/friends";

const UserPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const [posts, setPosts] = useState<IPost[]>([]);
  const [friends, setFriends] = useState<IFriend[]>([]);

  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  const getUserData = async () => {
    const user = await API.GET.user();
    if (!user) return;
    setUser(user);

    const postsResponse = await API.GET.myPosts();
    setPosts(postsResponse.posts);

    const friendsResponse = await API.GET.friends();
    setFriends(friendsResponse.friends);
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <LoadSpinner />
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-screen overflow-hidden">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-1/4 bg-gray-100 p-4">
          <div className="flex flex-col items-center">
            <img
              className="w-24 h-24 rounded-full mb-4 object-cover"
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              alt="Profile Pic"
            />
            <h1 className="text-xl font-bold">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Friends Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">{`Friends: ${friends.length}`}</h2>
            <div className="grid grid-cols-3 gap-4">
              {friends.slice(0, 9).map((friend) => (
                <div
                  key={friend.id}
                  className="flex flex-col items-center text-center"
                >
                  <img
                    className="w-16 h-16 rounded-md object-cover"
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt={`${friend.friend.first_name} ${friend.friend.last_name}`}
                  />
                  <p className="text-sm font-medium mt-2">
                    {friend.friend.first_name} {friend.friend.last_name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-y-auto p-6">
          <h2 className="text-2xl font-semibold mb-4">Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 bg-gray-50 border rounded-md shadow-sm"
              >
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-gray-700">{post.content}</p>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>Likes: {post.likes}</span>
                  <span>
                    Last Updated:{" "}
                    {new Date(post.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
