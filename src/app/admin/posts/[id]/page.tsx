"use client";
import React, { useEffect, useState }  from "react";
import { PostType } from "@/app/_types/PostType"
import { CategoryType } from "@/app/_types/CategoryTypes"
import { useParams,useRouter } from "next/navigation";
import styles from '@/styles/contact.module.scss'

// type PostsResponse = {
//   posts: PostType[]
// };

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<PostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("https://placehold.jp/800x400.png",);
  const [allCategories, setAllCategories] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(`/api/admin/categories`);
      const data = await res.json();

      setAllCategories(data.categories);
    }
    fetchCategories();
  },[])

  useEffect(() => {
  const fetcher = async () => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`);

      console.log('Response Status:', res.status);
      console.log('Response Headers:', res.headers);
      const data = await res.json();
      console.log('API Response:', data);

      setPost(data.post);
      setTitle(data.post.title);
      setContent(data.post.content);
      setThumbnailUrl(data.post.thumbnailUrl);
      setCategories(
        data.post.postCategories.map((pc) => pc.category.id)
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
      const res = await fetch(`/api/admin/posts/${id}`,{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        title,
        content,
        thumbnailUrl: thumbnailUrl,
        categories: categories.map((id) => ({id})),
      }),
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
          {allCategories.map((cat) => (
            <label key={cat.id} style={{ display: "block", marginBottom: 6 }}>
              <input type="checkbox" className={styles.form__checkbox}
                checked={categories.includes(cat.id)}
                onChange={(e) => {
                  const id = cat.id;
                  setCategories((prev) => {
                    const next = e.target.checked
                    ?(prev.includes(id) ? prev : [...prev,id])
                    : prev.filter((i) => i !== id);
                    console.log("next:", next);
                    return next;


                  });
                }}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
      <div className={styles.form__btn}>
        <button className={styles.submit} type="submit">更新</button>
        <button className={styles.delete} type="button" onClick={handleDeletePost}>削除</button>
      </div>
    </form>
  );
}
