"use client";
import React, { useEffect, useState }  from "react";
import { useParams,useRouter } from "next/navigation";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import PostForm, { type SubmitData } from "@/app/_components/PostForm";
import type { CategoryType, CategoriesResponse, } from '@/app/_types/CategoryTypes'
import type { PostResponse, UpdatePostRequestBody,PostData} from '@/app/_types/PostType'

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isLoading:sessionLoading } = useSupabaseSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostData | null>(null);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    if(sessionLoading || !token) return;
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
  },[token, sessionLoading]);

  useEffect(() => {
    if(sessionLoading || !token) return;
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`,{
        headers:{
          Authorization: token,
        }
      });

        console.log('Response Status:', res.status);
        console.log('Response Headers:', res.headers);
        const data: PostResponse = await res.json();
        console.log('API Response:', data);

        if(!data.post){
          return;
        }

        setPost({
          title:data.post.title,
          content: data.post.content,
          thumbnailImageKey: data.post.thumbnailImageKey,
          categories: data.post.categories.map((category) => category.id)
        })
        console.log(data.post)
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetcher();
  }, [id, token, sessionLoading]);

  const handleChangeThumbnailImageKey = (key:string) => {
    setPost((prev)=>{
      if(!prev) return prev;

      return{
        ...prev,
        thumbnailImageKey: key,
      }
    })
  }

  const handleSubmit = async (data:SubmitData) => {
    if(!post) return;
    try {
      const body:UpdatePostRequestBody ={
        title:data.title,
        content: data.content,
        thumbnailImageKey: post.thumbnailImageKey,
        categories: (data.categories.map((id)=>({id})) ),
      }
      const res = await fetch(`/api/admin/posts/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? '',
        },
        body: JSON.stringify(body),
    });

      if (res.ok) {
        alert("更新しました");
        router.push("/admin/posts");
      } else {
        console.error("更新失敗:", await res.text());
      }
    } catch (error) {
        console.error("送信エラー:", error);
    }

  };


  const handleDeletePost =  async () => {
    if(!confirm('記事を削除しますか？')) return;
    const res = await fetch(`/api/admin/posts/${id}`,{
      method: 'DELETE',
      headers: {
        Authorization: token ?? '',
      },
    })
    if (res.ok){
      alert('記事を削除しました')
      router.push("/admin/posts");
    } else {
        alert('削除できませんでした')
      }
  };

  if(loading) {
    return <p>Loading...</p>;
  }
  if(!post){
    return <p>記事が見つかりません</p>;
  }
  return (
    <>
      <PostForm
        pageTitle="記事編集"
        allCategories={allCategories}
        onSubmit={handleSubmit}
        buttonText="更新"
        onDelete={handleDeletePost}
        initialData={post}
        thumbnailImageKey={post.thumbnailImageKey}
        onChangeThumbnailImageKey={handleChangeThumbnailImageKey}
      />
    </>

  );
}
