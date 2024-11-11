"use client";
import Link from "next/link";
import React, { useEffect, useState }  from "react";
import { MicroCmsPost } from "@/app/_types/MicroCmsPost"
import styles from '@/styles/blogList.module.scss'

// type PostsResponse = {
//   posts: PostType[]
// };

export default function Home() {

  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  // const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch('https://hixddt5c8l.microcms.io/api/v1/posts', {
          headers: {
            'X-MICROCMS-API-KEY': process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string,
          },
        })
        const { contents } = await res.json()
        setPosts(contents)
      } finally {
        setLoading(false);
      }
    }

    fetcher()
  }, []);

  if(loading) {
    return <p>Loading...</p>;
  }
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>No posts available.</p>; // postsが空または配列でない場合
  }
  return (
    <ul className='card'>
      {posts.map((elem) => {
        const date = new Date(elem.createdAt);
        const dateText = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

        return (
          <li className={styles.card__item} key={elem.id}>
            <Link className={styles.card__link} href={`/posts/${elem.id}/`}>
              <div className={styles.card__head}>
                <p className={styles.card__date}>{dateText}</p>
                <ul className={styles.category}>
                  {elem.categories.map(category =>
                    <li className={styles.category__item} key={category.id}>{category.name}</li>
                  )}
                </ul>
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
  );
}
