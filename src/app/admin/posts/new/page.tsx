"use client";
import React, { useEffect, useState }  from "react";
import { useRouter } from "next/navigation";
import PostForm from "@/app/_components/PostForm";
import type { CategoryType, CategoriesResponse } from '@/app/_types/CategoryTypes'
import type { CreatePostRequestBody, CreatePostResponse} from '@/app/_types/PostType'

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.jp/800x400.png",);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`/api/admin/categories`);
      const data: CategoriesResponse = await res.json();

      setAllCategories(data.categories ?? []);
    }
    fetchCategories();
  },[])

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const body:CreatePostRequestBody ={
        title,
        content,
        thumbnailUrl: thumbnailUrl,
        categories: categories.map((id) => ({id}))
      }
      const res = await fetch(`/api/admin/posts`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

      if (res.ok) {
        const data: CreatePostResponse = await res.json();
        alert(data.message);
        router.push("/admin/posts");
      } else {
        console.error("作成失敗:", await res.text());
      }
    } catch (error) {
        console.error("送信エラー:", error);
    }

  };

  return (
    <>
      <PostForm
        pageTitle="記事作成"
        title={title}
        content={content}
        thumbnailUrl={thumbnailUrl}
        allCategories={allCategories}
        categories={categories}
        onChangeTitle={setTitle}
        onChangeContent={setContent}
        onChangeThumbnailUrl={setThumbnailUrl}
        onChangeCategories={setCategories}
        onSubmit={handleSubmit}
        buttonText="作成"
      />
    </>
  );
}
