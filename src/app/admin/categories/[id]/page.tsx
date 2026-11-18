"use client";
import React, { useEffect, useState }  from "react";
import { useParams,useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import CategoryForm from "@/app/_components/CategoryForm";
import type { CategoryResponse, UpdateCategoryRequestBody } from '@/app/_types/CategoryTypes'

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialName, setInitialName] = useState("");
  const { token, isLoading: sessionLoading } = useSupabaseSession();

  useEffect(() => {
    if (sessionLoading || !token) return;
    const fetchCategories = async () => {
      const res = await fetch(`/api/admin/categories/${id}`,{
        headers:{
          Authorization: token,
        }
      });
      const data:CategoryResponse = await res.json();

      if(!data.categories){
        return;
      }
      setInitialName(data.categories.name);
    }
    fetchCategories();

}, [id,token,sessionLoading]);

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
