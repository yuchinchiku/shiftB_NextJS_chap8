"use client";
import React, { useState }  from "react";
import { useRouter } from "next/navigation";
import styles from '@/styles/contact.module.scss'



export default function NewCategoryPage() {
  const router = useRouter();

  const [name, setName] = useState("");


  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/categories`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        name,
      }),
    });

      if (res.ok) {
        alert("作成しました");
        router.push("/admin/categories");
      } else {
        console.error("作成失敗:", await res.text());
      }
    } catch (error) {
        console.error("送信エラー:", error);
    }

  };


  return (
    <form onSubmit={handleSubmit}>
      <h1 className={styles.title}>カテゴリー作成</h1>
      <div className={styles.form__item}>
        <label className={styles.label}>カテゴリー名</label>
          <input className={styles.input} value={name} onChange={(e)=> setName(e.target.value)} />
      </div>
      <div className={styles.form__btn}>
        <button className={styles.submit} type="submit">作成</button>
      </div>
    </form>
  );
}
