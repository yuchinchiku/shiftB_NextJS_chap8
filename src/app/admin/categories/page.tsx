"use client";
import useSWR from 'swr'
import Link from "next/link";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import styles from '@/styles/blogList.module.scss'
import type { CategoryType, CategoriesResponse } from '@/app/_types/CategoryTypes'


export default function CategoryPage() {
  const { token, isLoading: sessionLoading } = useSupabaseSession();
  const fetcher = async ([url, token]: [string, string]) => {
    const res = await fetch(url,{
      headers: {
        Authorization: token,
      },
    });

    if (!res.ok) {
      throw new Error("カテゴリーの取得に失敗しました");
    }
    const data: CategoriesResponse = await res.json();
    return data;
  };

  const { data, error, isLoading } = useSWR(
    token ? ["/api/admin/categories",token]:null,
    fetcher
  );

  const categories = data?.categories ?? [];

  if(sessionLoading || isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div>
      <div className={styles.bloglist__header}>
        <h1 className={styles.title}>カテゴリー一覧</h1>
        <Link href="/admin/categories/new" className={styles.createButton}>
          新規作成
        </Link>
      </div>
      <ul>
        {categories.map((category) => (
            <li className={styles.card__item} key={category.id}>
              <Link className={styles.card__link} href={`/admin/categories/${category.id}/`}>
                <div className={styles.card__head}>
                  {category.name}
                </div>
              </Link>
            </li>
        ))}
      </ul>
    </div>
  );
}
