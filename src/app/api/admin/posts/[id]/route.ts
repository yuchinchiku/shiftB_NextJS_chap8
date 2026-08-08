import { NextRequest, NextResponse } from 'next/server'
import { Category, PrismaClient } from '@prisma/client'
import { PathParamsContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";

const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params
  try {
    // Postの一覧をDBから取得
    const post = await prisma.post.findUnique({
      where: {
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
    return NextResponse.json({ status: 'OK', post: post }, { status: 200 } )
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }
}

interface UpdatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailUrl: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params : { id: string }},
) => {
  const { id } = params

  const { title, content, categories, thumbnailUrl} : UpdatePostRequestBody = await request.json()
  try {
    const post = await prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data:{
        title,
        content,
        thumbnailUrl,
      },
    })

    await prisma.postCategory.deleteMany({
      where: {
        postId: parseInt(id),
      },
    })

    for (const category of categories){
      await prisma.postCategory.create({
        data:  {
          postId: post.id,
          categoryId: category.id,
        },
      })
    }

    return NextResponse.json({ status:'OK', post: post}, {status: 200 })
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message },{ status: 400 })
  }
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params
  try {
    await prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    })

    return NextResponse.json({ status: 'OK' }, { status: 200 })
  } catch (error) {
    if (error  instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 })
  }

}