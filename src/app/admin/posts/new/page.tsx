"use client";
import { useEffect, useState }  from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import PostForm, { type SubmitData } from "@/app/_components/PostForm";
import type { CategoryType, CategoriesResponse } from '@/app/_types/CategoryTypes'
import type { CreatePostRequestBody, CreatePostResponse, PostData} from '@/app/_types/PostType'

const initialData: PostData = {
  title: "",
  content: "",
  thumbnailImageKey: "",
  categories: [],
};

export default function NewPostPage() {
  const router = useRouter();
  const { token, isLoading } = useSupabaseSession();
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);

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

  const handleSubmit = async　(data:SubmitData) => {
    if (!token) return;
    try {
      const body:CreatePostRequestBody ={
        title: data.title,
        content: data.content,
        thumbnailImageKey: thumbnailImageKey,
        categories: (data.categories.map((id)=>({id})) ),
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
        const responseData: CreatePostResponse = await res.json();
        alert(responseData.message);
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
        thumbnailImageKey={thumbnailImageKey}
        allCategories={allCategories}
        onChangeThumbnailImageKey={setThumbnailImageKey}
        onSubmit={handleSubmit}
        buttonText="作成"
        initialData={initialData}
      />
    </>
  );
}
