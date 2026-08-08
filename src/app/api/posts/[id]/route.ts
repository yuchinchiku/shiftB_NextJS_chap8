import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string }},
) => {
  const { id } = params
  try {
    // Postの一覧をDBから取得
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
    // レスポンスを返す
    return NextResponse.json({ status: 'OK', post: post },{ status: 200 } )
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message },{ status: 400 })
  }
}
