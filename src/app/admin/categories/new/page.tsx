"use client";
import { useRouter } from "next/navigation";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import CategoryForm from "@/app/_components/CategoryForm";
import type { CreateCategoryResponse,CreateCategoryRequestBody } from '@/app/_types/CategoryTypes'



export default function NewCategoryPage() {
  const router = useRouter();
  const { token } = useSupabaseSession();

  const handleSubmit = async (data:{name:string}) => {
    if (!token) return;
    try {
      const body: CreateCategoryRequestBody = {
        name: data.name,
      }
      const res = await fetch(`/api/admin/categories`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
    });

      if (res.ok) {
        const resData: CreateCategoryResponse = await res.json();
        alert(resData.message);
        router.push("/admin/categories");
      } else {
        console.error("作成失敗:", await res.text());
      }
    } catch (error) {
        console.error("送信エラー:", error);
    }

  };


  return (
    <>
      <CategoryForm
        pageTitle="カテゴリー作成"
        onSubmit={handleSubmit}
        buttonText="作成"
      />
    </>
  );
}
