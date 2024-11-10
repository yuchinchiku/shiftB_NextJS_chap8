"use client";
import React, { useEffect, useState }  from "react";
import Link from "next/link";
import { PostType } from './_types/PostType';

type PostsResponse = {
  posts: PostType[]
};

const BlogList: React.FC = () => {

  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // APIでpostsを取得する処理をuseEffectで実行します。
  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts")
        const data = await res.json() as PostsResponse;
        setPosts(data.posts)
      } finally {
        setLoading(false);
      }
    }

    fetcher()
  }, []);

  if(loading) {
    return <p>Loading...</p>;
  }

  return(
    <ul className='card'>
      {posts.map((elem) => {
        const date = new Date(elem.createdAt);
        const dateText = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

        return (
          <li className='card__item' key={elem.id}>
            <Link className='card__link' href={`/posts/${elem.id}/`}>
              <div className='card__head'>
                <p className='card__date'>{dateText}</p>
                <ul className='category'>
                  {elem.categories.map(category =>
                    <li className='category__item' key={category}>{category}</li>
                  )}
                </ul>
              </div>
              <div className='card__body'>
                  <p className='card__title'>{elem.title}</p>
                  <p className='card__desc' dangerouslySetInnerHTML={{ __html: elem.content }} />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};


export default BlogList;