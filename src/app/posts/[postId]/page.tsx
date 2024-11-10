"use client";
import { API_BASE_URL } from "@/app/constants";
import React, { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import { PostType } from '@/app/_types/PostType';
import Image from 'next/image';


const PostsDetails: React.FC = () => {

  const { postId } = useParams();
  const [post, setPost] = useState<PostType | null>(null)
  const [loading, setLoading] = useState<boolean>(true);

  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      try {
        console.log(`Fetching data for post ID: ${postId}`);
        const res = await fetch(`${API_BASE_URL}/posts/${postId}`);
        const data = await res.json();
        setPost(data.post);
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
      <div className='post__img'>
        <Image src={post.thumbnailUrl} alt={post.title} width={800} height={400} />
      </div>
      <div className='post__content'>
        <div className='post__head'>
          <p className='post__date'>{dateText}</p>
          <ul className='category'>
            {post.categories.map(category => (
              <li className='category__item' key={category}>{category}</li>
              ))}
          </ul>
        </div>
        <h1 className='post__title'>{post.title}</h1>
        <p className='post__details' dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
    </article>
  );
}

export default PostsDetails;
