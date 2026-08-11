import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type {PostResponse, ErrorResponse} from '@/app/_types/PostType'

const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string }},
) => {
  const { id } = params
  try {
    // Postを1件DBから取得
    const post = await prisma.post.findUnique({
      where: {
        //  parseIntがなぜ必要なのか？
        // リクエストのURLに含まれる値（id）は基本的に文字列として扱われます。
        // 例えば、idには"42"（文字列）が入ります。データベースに問い合わせるとき、数値として比較する必要があるので、"42"を42（数値）に変換します。
        id: parseInt(id),
      },
      include: {
        // カテゴリーも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
    if (!post) {
      const response: PostResponse = {
        status: 'NOT_FOUND',
        post: null
      }
      return NextResponse.json(response, { status: 404 } )
    }
    // レスポンスを返す
    const response: PostResponse = {
      status: 'OK',
      post: {
        id: post.id,
        title: post.title,
        thumbnailUrl: post.thumbnailUrl,
        createdAt: post.createdAt.toISOString(),
        categories: post.postCategories.map(
          (postCategory) => postCategory.category
        ),
        content: post.content,
      }
    }
    return NextResponse.json(response, { status: 200 } )
  } catch (error) {
    if (error instanceof Error){
      const response: ErrorResponse = {
        status: error.message,
      }
      return NextResponse.json(response, { status: 400 })
    }
  }
}
