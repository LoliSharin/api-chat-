import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

@Injectable()
export class ChatService {
  async findMessages() {
    // include user relation (generated client exposes `user` on Message)
    return prisma.message.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } })
  }

  // now requires chatId to know which chat the message belongs to
  async createMessage({ chatId, text, email, username }: { chatId: string; text: string; email: string; username?: string }) {
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      const uname = username || email.split('@')[0] || `user_${Math.random().toString(36).slice(2, 8)}`
      user = await prisma.user.create({ data: { email, username: uname } })
    }

    // encryptedBody and iv are required in the schema (Bytes). For now store plaintext bytes as placeholder.
    const encrypted = Buffer.from(text || '')
    const iv = Buffer.from([])

    const message = await prisma.message.create({
      data: {
        text,
        encryptedBody: encrypted,
        iv,
        chat: { connect: { id: chatId } },
        user: { connect: { id: user.id } },
      },
    })
    return message
  }

  async createChat({ name, description, participants }: { name: string; description?: string; participants: string[] }) {
    // DB migration uses column `title` for chat name — map incoming `name` to `title`
    return prisma.chat.create({
      data: {
        title: name,
        description,
        type: 'GROUP',
        participants: {
          create: participants.map((id) => ({ user: { connect: { id } }, role: 'PARTICIPANT' })),
        },
      },
      include: { participants: { include: { user: true } } },
    })
  }

  async getChats() {
    return prisma.chat.findMany({ include: { participants: { include: { user: true } } } })
  }

  async updateChat(id: string, { name, description }: { name?: string; description?: string }) {
    // map `name` -> `title` in DB
    return prisma.chat.update({
      where: { id },
      data: { title: name, description },
    })
  }
}
