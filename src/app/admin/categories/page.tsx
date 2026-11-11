"use client";
import Link from "next/link";
import React, { useEffect, useState }  from "react";
import styles from '@/styles/blogList.module.scss'
import type { CategoryType, CategoriesResponse } from '@/app/_types/CategoryTypes'


export default function CategoryPage() {
  const [categories, setCategories] =  useState<CategoryType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // APIでpostsを取得する処理をuseEffectで実行します。

  useEffect(() => {
  const fetcher = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data: CategoriesResponse = await res.json();

      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  fetcher();
}, []);

  if(loading) {
    return <p>Loading...</p>;
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
        {categories.map((category) => {
          return (
            <li className={styles.card__item} key={category.id}>
              <Link className={styles.card__link} href={`/admin/categories/${category.id}/`}>
                <div className={styles.card__head}>
                  {category.name}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
