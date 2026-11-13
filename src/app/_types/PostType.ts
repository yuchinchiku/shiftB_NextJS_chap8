import type { CategoryType } from '@/app/_types/CategoryTypes';

export type PostType = {
  id: number;
  title:string;
  thumbnailImageKey: string;
  createdAt: string;
  categories: CategoryType[];
  content: string;
};

export type PostResponse = {
  status: string;
  post: PostType | null;
}

export type UpdatePostRequestBody = {
  title:string;
  content: string;
  categories: {id: number}[];
  thumbnailImageKey: string;

}

export type UpdatePostResponse = {
  status: string;
  post: PostType | null;
}

export type DeletePostResponse = {
  status: string;
}
export type ErrorResponse = {
  status: string;
};

export type CreatePostRequestBody = {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailImageKey: string;
}

export type PostListType = {
  id: number;
  title:string;
  createdAt: string;
  content: string;
};

export type PostListResponse = {
  status: string;
  posts: PostListType[];
};

export type CreatePostResponse = {
  status: string;
  message: string;
  id: number;
};