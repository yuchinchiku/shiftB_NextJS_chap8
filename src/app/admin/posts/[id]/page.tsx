"use client";
import useSWR from "swr";
import { useParams,useRouter } from "next/navigation";
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import PostForm, { type SubmitData } from "@/app/_components/PostForm";
import type { CategoriesResponse, } from '@/app/_types/CategoryTypes'
import type { PostResponse, UpdatePostRequestBody} from '@/app/_types/PostType'

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isLoading:sessionLoading } = useSupabaseSession();

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


  const postFetcher = async ([url, token]: [string, string]) => {
    const res = await fetch(url,{
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error("記事の取得に失敗しました");
    }
    const data: PostResponse = await res.json();
    if(!data.post){
      throw new Error("記事が見つかりません");
    }
    return{
      title:data.post.title,
      content: data.post.content,
      thumbnailImageKey: data.post.thumbnailImageKey,
      categories: data.post.categories.map((category) => category.id)
    }
  };

  const { data:post, error:postError, isLoading:postLoading, mutate } 
  = useSWR(
    token ? [`/api/admin/posts/${id}`,token]:null,
    postFetcher
  );

  const handleChangeThumbnailImageKey = (key:string) => {
    mutate((prev)=>{
      if(!prev) return prev;

      return{
        ...prev,
        thumbnailImageKey: key,
      };
    }, {revalidate: false});
  };

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

  if(sessionLoading || categoriesLoading || postLoading) {
    return <p>Loading...</p>;
  }
  if(categoriesError){
    return <p>{categoriesError.message}</p>;
  }
  if(postError){
    return <p>{postError.message}</p>;
  }
  if(!post){
    return <p>記事が見つかりません</p>;
  }
  return (
    <>
      <PostForm
        pageTitle="記事編集"
        allCategories={categories}
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
