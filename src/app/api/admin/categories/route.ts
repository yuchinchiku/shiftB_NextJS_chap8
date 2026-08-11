import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type { CategoriesResponse, ErrorResponse, CreateCategoryResponse, CreateCategoryRequestBody } from '@/app/_types/CategoryTypes'

const prisma = new PrismaClient()


export const GET = async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    const response: CategoriesResponse = {
      status: 'OK',
      categories: categories,
    }
    return NextResponse.json(response, { status: 200 })
  } catch (error){
    if (error instanceof Error) {
      const response: ErrorResponse = {
        status: error.message,
      }
      return NextResponse.json(response, {status: 400 })
    }
  }
}


export const POST = async (request: NextRequest, context: any ) => {
  try {
    const body  = await request.json()
    const { name } : CreateCategoryRequestBody  = body
    const data = await prisma.category.create({
      data: {
        name
      }
    })

    const response: CreateCategoryResponse = {
      status: 'OK',
      message: '作成しました',
      id: data.id
    }
    return NextResponse.json(response)
  } catch(error){
    if ( error instanceof Error) {
      const response: ErrorResponse = {
        status: error.message,
      }
      return NextResponse.json(response, {status: 400 })
    }
  }
}