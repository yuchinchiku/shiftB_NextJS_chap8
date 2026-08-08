"use client";
import React, { useEffect, useState }  from "react";
import { CategoryType } from "@/app/_types/CategoryTypes"
import { useRouter } from "next/navigation";
import styles from '@/styles/contact.module.scss'

// type PostsResponse = {
//   posts: PostType[]
// };

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.jp/800x400.png",);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`/api/admin/categories`);
      const data = await res.json();

      setAllCategories(data.categories);
    }
    fetchCategories();
  },[])

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/posts`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl: thumbnailUrl,
        categories: [{id: Number(categories)}]
      }),
    });

      if (res.ok) {
        alert("作成しました");
        router.push("/admin/posts");
      } else {
        console.error("作成失敗:", await res.text());
      }
    } catch (error) {
        console.error("送信エラー:", error);
    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={styles.title}>記事編集</h1>
      <div className={styles.form__item}>
        <label className={styles.label}>タイトル</label>
        <div className={styles.form__input}>
          <input className={styles.input} value={title} onChange={(e)=> setTitle(e.target.value)} />
        </div>
      </div>
      <div className={styles.form__item}>
        <label className={styles.label}>内容</label>
        <div className={styles.form__input}>
          <textarea className={styles.textarea} value={content}rows={8}  onChange={(e)=> setContent(e.target.value)} />
        </div>
      </div>
      <div className={styles.form__item}>
        <label className={styles.label}>サムネイルURL</label>
        <div className={styles.form__input}>
          <input className={styles.input} value={thumbnailUrl} onChange={(e)=> setThumbnailUrl(e.target.value)} />
        </div>
      </div>
      <div className={styles.form__item}>
        <label className={styles.label}>カテゴリ</label>
        <div className={styles.form__input}>
          <select className={styles.input} value={categories} onChange={(e)=> setCategories(e.target.value)} >
            <option value="">選択してください</option>
            {allCategories.map((cat) =>
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          )}
          </select>
        </div>
      </div>
      <div className={styles.form__btn}>
        <button className={styles.submit} type="submit">作成</button>
      </div>
    </form>
  );
}
