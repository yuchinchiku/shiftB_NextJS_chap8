"use client";
import useSWR from "swr";
import Link from "next/link";
import type { PostListResponse } from "@/app/_types/PostType"
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import styles from '@/styles/blogList.module.scss'


export default function Home() {
  const { token, isLoading: sessionLoading } = useSupabaseSession()

  const fetcher = async ([url, token]: [string, string]) => {
    const res = await fetch(url,{
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error("記事一覧の取得に失敗しました");
    }
    const data: PostListResponse = await res.json();
    return data;
  };
  const { data, error, isLoading } = useSWR(
    token ? ["/api/admin/posts",token]:null,
    fetcher
  );
  const posts = data?.posts ?? [];
  if(sessionLoading || isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
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
