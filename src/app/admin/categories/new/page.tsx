"use client";
import React, { useState }  from "react";
import { useRouter } from "next/navigation";
import CategoryForm from "@/app/_components/CategoryForm";
import type { CreateCategoryResponse,CreateCategoryRequestBody } from '@/app/_types/CategoryTypes'



export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");


  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const body: CreateCategoryRequestBody = {
        name
      }
      const res = await fetch(`/api/admin/categories`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

      if (res.ok) {
        const data: CreateCategoryResponse = await res.json();
        alert(data.message);
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
        name={name}
        onChangeName={setName}
        onSubmit={handleSubmit}
        buttonText="作成"
      />
    </>
  );
}
