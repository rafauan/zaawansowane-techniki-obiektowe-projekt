"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PostForm from "../PostForm";
import { API } from "@/api/API";

const CreatePost = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    try {
      //TODO: add image
      const res = await API.POST.createPost({ title, content, image: null });
      if (!!res) router.replace("/posts");
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <PostForm
      pageTitle="Utwórz post"
      titleValue={title}
      contentValue={content}
      onChangeContent={setContent}
      onChangeTitle={setTitle}
      handleSubmit={handleSubmit}
    />
  );
};

export default CreatePost;
