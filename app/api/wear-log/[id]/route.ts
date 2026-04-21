import { auth } from '@clerk/nextjs/server'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { id } = await params

  try {
    await prisma.wearLog.delete({
      where: { id, userId: user.id },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Delete failed:', e)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}