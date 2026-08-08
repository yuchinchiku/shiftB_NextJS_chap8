import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma  = new PrismaClient()

export const GET = async (request: NextRequest) => {
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
    return NextResponse.json({ status: 'OK', posts: posts},{ status: 200 } )
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message },{ status: 400 })
  }
}

interface CreatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailUrl: string
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
    const { title, content, categories, thumbnailUrl } : CreatePostRequestBody = body

    const data = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
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
    return NextResponse.json({
      status: 'OK',
      message: '作成しました',
      id: data.id,
    })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 })
    }
  }
}