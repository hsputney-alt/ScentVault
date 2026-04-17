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

  const { fragranceId, occasion, notes } = await request.json()
  if (!fragranceId) return NextResponse.json({ error: 'Missing fragranceId' }, { status: 400 })

  const user = await getOrCreateUser(userId)

  const log = await prisma.wearLog.create({
    data: {
      userId: user.id,
      fragranceId,
      occasion: occasion ?? null,
      notes: notes ?? null,
      wornDate: new Date(),
    },
  })

  return NextResponse.json({ log })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await getOrCreateUser(userId)

  const logs = await prisma.wearLog.findMany({
    where: { userId: user.id },
    include: {
      fragrance: {
        include: { house: true },
      },
    },
    orderBy: { wornDate: 'desc' },
  })

  return NextResponse.json({ logs })
}