import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { purchasePrice, bottleSizeMl, fullness } = await request.json()

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const entry = await prisma.userCollection.update({
    where: { id },
    data: {
      ...(purchasePrice !== undefined && { purchasePrice }),
      ...(bottleSizeMl !== undefined && { bottleSizeMl }),
      ...(fullness !== undefined && { fullness }),
    },
  })

  return NextResponse.json({ entry })
}