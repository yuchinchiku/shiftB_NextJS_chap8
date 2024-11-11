"use client";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import { MicroCmsPost } from "@/app/_types/MicroCmsPost"
import Image from 'next/image';
import styles from '@/styles/blogList.module.scss'


const PostsDetails: React.FC = () => {

  const { postId } = useParams();
  const [post, setPost] = useState<MicroCmsPost | null>(null)
  const [loading, setLoading] = useState<boolean>(true);

  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      try {
        console.log(`Fetching data for post ID: ${postId}`);
        const res = await fetch(`https://hixddt5c8l.microcms.io/api/v1/posts/${postId}`,
          {
            headers: {
              'X-MICROCMS-API-KEY': process.env
                .NEXT_PUBLIC_MICROCMS_API_KEY as string,
            },
          }
        );
        const data = await res.json();
        setPost(data);
      } finally {
        setLoading(false);
      }
    }

    fetcher();
  }, [postId]);

  if(loading) {
    return <p>Loading...</p>;
  } else if (!post) {
    return <div>記事が見つかりませんでした。</div>;
  }

  const date = new Date(post.createdAt);
  const dateText = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

  return(
    <article className='post'>
      <div className={styles.post__img}>
        <Image src={post.thumbnail.url} alt={post.title} width={800} height={400} />
      </div>
      <div className={styles.post__content}>
        <div className={styles.post__head}>
          <p className={styles.post__date}>{dateText}</p>
          <ul className={styles.category}>
            {post.categories.map(category => (
              <li className={styles.category__item} key={category.id}>{category.name}</li>
              ))}
          </ul>
        </div>
        <h1 className={styles.post__title}>{post.title}</h1>
        <p className={styles.post__details} dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}

export default PostsDetails;
