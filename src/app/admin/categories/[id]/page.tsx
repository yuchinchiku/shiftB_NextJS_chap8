"use client";
import React, { useEffect, useState }  from "react";
import { useParams,useRouter } from "next/navigation";
import CategoryForm from "@/app/_components/CategoryForm";
import type { CategoryResponse, UpdateCategoryRequestBody } from '@/app/_types/CategoryTypes'

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data:CategoryResponse = await res.json();

      if(!data.categories){
        return;
      }
      setName(data.categories.name);
    }
    fetchCategories();

}, [id]);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const body: UpdateCategoryRequestBody = {
        name
      }
      const res = await fetch(`/api/admin/categories/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
    if(!confirm('カテゴリーを削除しますか？')) return
    await fetch(`/api/admin/categories/${id}`,{
      method: 'DELETE',
    })
    alert('カテゴリーを削除しました')
    router.push("/admin/categories");
  };
  return (
    <>
      <CategoryForm
        pageTitle="カテゴリー編集"
        name={name}
        onChangeName={setName}
        onSubmit={handleSubmit}
        buttonText="更新"
        onDelete={handleDeleteCategory}
      />
    </>
  );
}
