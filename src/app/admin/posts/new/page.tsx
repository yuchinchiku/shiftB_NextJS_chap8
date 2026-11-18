"use client";
import useSWR from "swr";
import { useState }  from "react";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import PostForm, { type SubmitData } from "@/app/_components/PostForm";
import type { CategoriesResponse } from '@/app/_types/CategoryTypes'
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

  const categoriesFetcher = async ([url, token]: [string, string]) => {
    const res = await fetch(url,{
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error("カテゴリーの取得に失敗しました");
    }
    const data: CategoriesResponse = await res.json();
    return data;
  };
  const { data:categoriesData, error:categoriesError, isLoading:categoriesLoading } 
  = useSWR(
    token ? ["/api/admin/categories",token]:null,
    categoriesFetcher
  );

  const categories = categoriesData?.categories ?? [];

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
  if(isLoading || categoriesLoading) {
    return <p>Loading...</p>;
  }
  if(categoriesError){
    return <p>{categoriesError.message}</p>;
  }

  return (
    <>
      <PostForm
        pageTitle="記事作成"
        thumbnailImageKey={thumbnailImageKey}
        allCategories={categories}
        onChangeThumbnailImageKey={setThumbnailImageKey}
        onSubmit={handleSubmit}
        buttonText="作成"
        initialData={initialData}
      />
    </>
  );
}
