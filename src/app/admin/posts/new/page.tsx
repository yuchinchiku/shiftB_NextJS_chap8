"use client";
import React, { useEffect, useState }  from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import PostForm from "@/app/_components/PostForm";
import type { CategoryType, CategoriesResponse } from '@/app/_types/CategoryTypes'
import type { CreatePostRequestBody, CreatePostResponse} from '@/app/_types/PostType'

export default function NewPostPage() {
  const router = useRouter();
  const { token, isLoading } = useSupabaseSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState<number[]>([]);

  useEffect(() => {
    if(isLoading || !token) return;
    const fetchCategories = async () => {
      const res = await fetch(`/api/admin/categories`,{
        headers:{
          Authorization: token,
        }
      });
      const data: CategoriesResponse = await res.json();

      setAllCategories(data.categories ?? []);
    }
    fetchCategories();
  },[token, isLoading]);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const body:CreatePostRequestBody ={
        title,
        content,
        thumbnailImageKey: thumbnailImageKey,
        categories: categories.map((id) => ({id}))
      }
      const res = await fetch(`/api/admin/posts`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? '',
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
        thumbnailImageKey={thumbnailImageKey}
        allCategories={allCategories}
        categories={categories}
        onChangeTitle={setTitle}
        onChangeContent={setContent}
        onChangeThumbnailImageKey={setThumbnailImageKey}
        onChangeCategories={setCategories}
        onSubmit={handleSubmit}
        buttonText="作成"
      />
    </>
  );
}
