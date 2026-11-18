"use client";
import useSWR from "swr";
import { useParams,useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import CategoryForm from "@/app/_components/CategoryForm";
import type { CategoryResponse, UpdateCategoryRequestBody } from '@/app/_types/CategoryTypes'

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, isLoading: sessionLoading } = useSupabaseSession();

  const fetcher = async ([url, token]: [string, string]) => {
    const res = await fetch(url,{
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error("カテゴリーの取得に失敗しました");
    }
    const data: CategoryResponse = await res.json();
    return data;
  };
  const { data, error, isLoading } = useSWR(
    token ? [`/api/admin/categories/${id}`,token]:null,
    fetcher
  );
  const initialName = data?.categories?.name ?? "";

  if(sessionLoading || isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  const handleSubmit = async (data:{name:string}) => {
    if (!token) return;
    try {
      const body: UpdateCategoryRequestBody = {
        name: data.name,
      }
      const res = await fetch(`/api/admin/categories/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ?? '',
        },
      body: JSON.stringify(body),
    });

      if (res.ok) {
        alert("更新しました");
        router.push("/admin/categories");
      } else {
        console.error("更新失敗:", await res.text());
      }
    } catch (error) {
        console.error("送信エラー:", error);
    }

  };


  const handleDeleteCategory =  async () => {
    if (!token) return;
    if(!confirm('カテゴリーを削除しますか？')) return;
    await fetch(`/api/admin/categories/${id}`,{
      method: 'DELETE',
      headers: {
        Authorization: token ?? '',
      },
    })
    alert('カテゴリーを削除しました')
    router.push("/admin/categories");
  };
  return (
    <>
      <CategoryForm
        pageTitle="カテゴリー編集"
        onSubmit={handleSubmit}
        buttonText="更新"
        onDelete={handleDeleteCategory}
        initialName={initialName}
      />
    </>
  );
}
