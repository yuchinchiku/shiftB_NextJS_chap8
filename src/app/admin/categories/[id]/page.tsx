"use client";
import React, { useEffect, useState }  from "react";
import { useParams,useRouter } from "next/navigation";
import styles from '@/styles/contact.module.scss'

// type PostsResponse = {
//   posts: PostType[]
// };

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`/api/admin/categories/${id}`);
      const data = await res.json();

      setName(data.categories.name);
    }
    fetchCategories();

}, [id]);

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/categories/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        name,
      }),
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
    <form onSubmit={handleSubmit}>
      <h1 className={styles.title}>カテゴリー編集</h1>
      <div className={styles.form__item}>
        <label className={styles.label}>カテゴリー名</label>
          <input className={styles.input} value={name} onChange={(e)=> setName(e.target.value)} />
      </div>
      <div className={styles.form__btn}>
        <button className={styles.submit} type="submit">更新</button>
        <button className={styles.delete} type="button" onClick={handleDeleteCategory}>削除</button>
      </div>
    </form>
  );
}
