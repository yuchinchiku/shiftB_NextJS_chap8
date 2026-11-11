"use client";
import React, { useEffect, useState }  from "react";
import { useParams,useRouter } from "next/navigation";
import PostForm from "@/app/_components/PostForm";
import type { CategoryType, CategoriesResponse, } from '@/app/_types/CategoryTypes'
import type { PostResponse, UpdatePostRequestBody} from '@/app/_types/PostType'

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
  const fetcher = async () => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`);

      console.log('Response Status:', res.status);
      console.log('Response Headers:', res.headers);
      const data: PostResponse = await res.json();
      console.log('API Response:', data);

      if(!data.post){
        return;
      }

      setTitle(data.post.title);
      setContent(data.post.content);
      setThumbnailUrl(data.post.thumbnailUrl);
      setCategories(
        data.post.categories.map((category) => category.id)
      );
      console.log(data.post)
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  fetcher();
}, [id]);
useEffect(() => {
  console.log("categories updated:", categories);
}, [categories]);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const body:UpdatePostRequestBody ={
        title,
        content,
        thumbnailUrl: thumbnailUrl,
        categories: categories.map((id) => ({id}))
      }
      const res = await fetch(`/api/admin/posts/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
    if(!confirm('記事を削除しますか？')) return
    await fetch(`/api/admin/posts/${id}`,{
      method: 'DELETE',
    })
    alert('記事を削除しました')
    router.push("/admin/posts");
  };

  if(loading) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <PostForm
        pageTitle="記事編集"
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
        buttonText="更新"
        onDelete={handleDeletePost}
      />
    </>

  );
}
