import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { supabase } from "@/app/_libs/supabase";
import type {PostListResponse, CreatePostRequestBody, CreatePostResponse, ErrorResponse} from '@/app/_types/PostType'

const prisma  = new PrismaClient()

export const GET = async (request: NextRequest) => {
  // GET関数の引数からrequestを受け取り、その中にAuthorizationヘッダーが含まれているので、それを取り出す
  const token = request.headers.get('Authorization') ?? ''

  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);

  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返す
  if (error)
    return NextResponse.json({ status: error.message }, { status: 400 })

　　　　// tokenが正しい場合、以降が実行される
  try{
    const posts = await prisma.post.findMany({
      include: {
        postCategories: {
          // includedで関連するテーブル（リレーション）から詳細データを取得する
          include: {
            category: {
            //なぜselectを使うの？
            // 必要なデータだけを取得して、クエリを効率化できます。
            // 不要なフィールドを省くことで、ネットワーク負荷を軽減できます。
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    const response: PostListResponse = {
      status: 'OK',
      posts: posts.map((post) => ({
        id: post.id,
        title:post.title,
        createdAt: post.createdAt.toISOString(),
        content: post.content,
      }))
    }
    return NextResponse.json(response,{ status: 200 } )
  } 
  // catch (error) {
  //   if (error instanceof Error){
  //     const response: ErrorResponse = {
  //       status: error.message,
  //     }
  //     return NextResponse.json(response, { status: 400 })
  //   }
  // }
  catch (error) {
  console.error("GET API ERROR:", error);

  const message =
    error instanceof Error ? error.message : String(error);

  return NextResponse.json(
    { status: message },
    { status: 500 }
  );
}
}

// context とは？
// context は、追加情報やパラメータを渡すためのもの。
// たとえば、Next.jsや他のフレームワークでは、contextに以下の情報が含まれる場合があります：
// ルートパラメータ（例: /posts/:id のようなidの値）
// 認証情報（ユーザー情報など）
// 環境変数や設定情報
export const POST = async (request: Request, context: any) => {
  try{
    const body = await request.json()
    const { title, content, categories, thumbnailImageKey } : CreatePostRequestBody = body

    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailImageKey,
      }
    })
    // ↑ここまでで記事だけは作られている
    // ↓ここでカテゴリを紐付け（記事とカテゴリを繋ぐ）
      // 複数カテゴリ対応
    for (const category of categories) {
      // 中間テーブルに保存
      await prisma.postCategory.create({
        data: {
          categoryId: category.id,
          postId: data.id,
        }
      })
    }

    const response: CreatePostResponse = {
      status: 'OK',
      message: '作成しました',
      id: data.id,
    }
    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof Error){
      const response: ErrorResponse = {
        status: error.message,
      }
      return NextResponse.json(response, { status: 400 })
    }
  }
}