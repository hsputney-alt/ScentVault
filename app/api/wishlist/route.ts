import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

async function getOrCreateUser(clerkId: string) {
  return await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      username: clerkId,
    },
  })
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fragranceId } = await request.json()
  if (!fragranceId) return NextResponse.json({ error: 'Missing fragranceId' }, { status: 400 })

  const user = await getOrCreateUser(userId)

  const entry = await prisma.userWishlist.upsert({
    where: { userId_fragranceId: { userId: user.id, fragranceId } },
    update: {},
    create: { userId: user.id, fragranceId },
  })

  return NextResponse.json({ entry })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getOrCreateUser(userId)

  const wishlist = await prisma.userWishlist.findMany({
    where: { userId: user.id },
    include: { fragrance: { include: { house: true } } },
  })

  return NextResponse.json({ wishlist })
}

export async function DELETE(request: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { fragranceId } = await request.json()
  const user = await getOrCreateUser(userId)

  await prisma.userWishlist.delete({
    where: { userId_fragranceId: { userId: user.id, fragranceId } },
  })

  return NextResponse.json({ success: true })
}