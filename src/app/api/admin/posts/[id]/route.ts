import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type {PostResponse, ErrorResponse, UpdatePostRequestBody, UpdatePostResponse, DeletePostResponse} from '@/app/_types/PostType'

const prisma = new PrismaClient()

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const { id } = params
  try {
    // Postを1件DBから取得
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
    const updatedPost = await prisma.post.findUnique({
      where: {
        id: post.id,
      },
      include: {
        postCategories: {
          include: {
            category: {
              select: {
                id:true,
                name:true,
              },
            },
          },
        },
      }
    })

    if(!updatedPost){
      const response: ErrorResponse ={
        status: '記事が見つかりません'
      }
      return NextResponse.json(response, {status: 404})
    }

    const response: UpdatePostResponse = {
      status: 'OK',
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        thumbnailUrl: updatedPost.thumbnailUrl,
        createdAt: updatedPost.createdAt.toISOString(),
        categories: updatedPost.postCategories.map(
          (updatedPostCategory) => updatedPostCategory.category
        ),
        content: updatedPost.content,
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

    const response: DeletePostResponse ={
      status: 'OK'
    }
    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    if (error instanceof Error){
      const response: ErrorResponse = {
        status: error.message,
      }
      return NextResponse.json(response, { status: 400 })
    }
  }

}