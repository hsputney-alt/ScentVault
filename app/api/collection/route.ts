import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

async function getOrCreateUser(clerkId: string) {
  return await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId, username: clerkId },
  })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fragranceId } = await request.json()
  if (!fragranceId) return NextResponse.json({ error: 'Missing fragranceId' }, { status: 400 })

  const user = await getOrCreateUser(userId)

  try {
    const entry = await prisma.userCollection.create({
      data: { userId: user.id, fragranceId },
    })

    const count = await prisma.userCollection.count({
      where: { userId: user.id, fragranceId },
    })

    return NextResponse.json({ entry, count })
  } catch (error) {
    console.error('Collection create error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const url = new URL(request.url)
  const fragranceId = url.searchParams.get('fragranceId')

  const user = await getOrCreateUser(userId)

  if (fragranceId) {
    const count = await prisma.userCollection.count({
      where: { userId: user.id, fragranceId },
    })
    return NextResponse.json({ count })
  }

  const collection = await prisma.userCollection.findMany({
    where: { userId: user.id },
    include: { fragrance: { include: { house: true } } },
  })

  return NextResponse.json({ collection })
}

export async function DELETE(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fragranceId } = await request.json()
  const user = await getOrCreateUser(userId)

  const entries = await prisma.userCollection.findMany({
    where: { userId: user.id, fragranceId },
    orderBy: { addedAt: 'desc' },
    take: 1,
  })

  if (entries.length > 0) {
    await prisma.userCollection.delete({
      where: { id: entries[0].id },
    })
  }

  return NextResponse.json({ success: true })
}