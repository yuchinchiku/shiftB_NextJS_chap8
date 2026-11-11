import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import type { CategoryResponse, UpdateCategoryResponse, ErrorResponse, DeleteCategoryResponse } from '@/app/_types/CategoryTypes'

const prisma  = new PrismaClient()

export const GET = async (
  request: NextRequest,
  { params } : {params:{ id: string }},
) => {
  const { id } = params

  try{
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(id),
      }
    })

    const response: CategoryResponse = {
      status: 'OK',
      categories: category,
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

interface UpdateCategoryRequestBody {
  name: string
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params

  const { name } : UpdateCategoryRequestBody = await request.json()

  try{
    const category = await prisma.category.update({
      where: {
        id : parseInt(id)
      },
      data: {
        name
      }
    })

    const response: UpdateCategoryResponse = {
      status: 'OK',
      categories: category,
    }
    return NextResponse.json(response)
  } catch(error){
    if (error instanceof Error){
    const response: ErrorResponse = {
      status: error.message,
    }
      return NextResponse.json(response, {status: 400 })
    }
  }
}

export const DELETE = async(
  request: NextRequest,
  { params }: { params : { id: string }}
) => {
  const { id } = params

  try{
    await prisma.category.delete({
      where: {
        id: parseInt(id)
      }
    })
    const response: DeleteCategoryResponse ={
      status: 'OK',

    }
    return NextResponse.json(response, { status: 200 })
  } catch(error){
    if (error instanceof Error){
      const response: ErrorResponse = {
        status: error.message,
      }
      return NextResponse.json(response, {status: 400 })
    }
  }
}