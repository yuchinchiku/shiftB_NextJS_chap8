"use client";
import Link from "next/link";
import React, { useEffect, useState }  from "react";
import type { PostListResponse, PostListType } from "@/app/_types/PostType"
import styles from '@/styles/blogList.module.scss'


export default function Home() {
  const [posts, setPosts] = useState<PostListType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // APIでpostsを取得する処理をuseEffectで実行します。

  useEffect(() => {
  const fetcher = async () => {
    try {
      const res = await fetch('/api/admin/posts');

      console.log('Response Status:', res.status);
      console.log('Response Headers:', res.headers);
      const data: PostListResponse = await res.json();
      console.log('API Response:', data);

      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  fetcher();
}, []);

  if(loading) {
    return <p>Loading...</p>;
  }
  if (!Array.isArray(posts) || posts.length === 0) {
    console.log("現在のposts:", posts);
    // postsが空または配列でない場合
    return <p>No posts available.</p>;
  }
  return (
    <div>
      <div className={styles.bloglist__header}>
        <h1 className={styles.title}>記事一覧</h1>
        <Link href="/admin/posts/new" className={styles.createButton}>
          新規作成
        </Link>
      </div>
      <ul>
        {posts.map((elem) => {
          const date = new Date(elem.createdAt);
          const dateText = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

          return (
            <li className={styles.card__item} key={elem.id}>
              <Link className={styles.card__link} href={`/admin/posts/${elem.id}/`}>
                <div className={styles.card__head}>
                  <p className={styles.card__date}>{dateText}</p>

                </div>
                <div className={styles.card__body}>
                    <p className={styles.card__title}>{elem.title}</p>
                    <p className={styles.card__desc} dangerouslySetInnerHTML={{ __html: elem.content }} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
