import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type {PostListResponse, ErrorResponse} from '@/app/_types/PostType'

const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (request: NextRequest) => {
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
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
      // 作成日時の降順で取得
      orderBy: {
        createdAt: 'desc',
      },
    })
    // レスポンスを返す

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
  } catch (error) {
    if (error instanceof Error){
      const response: ErrorResponse = {
        status: error.message,
      }
      return NextResponse.json(response, { status: 400 })
    }
  }
}
