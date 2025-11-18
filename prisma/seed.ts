import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@local' },
    update: {},
    create: { username: 'admin', email: 'admin@local' },
  })
  console.log('Seeded user:', user.email)
}
(async () => {
  try {
    await main()
  } catch (e) {
    console.error('Seed error:', e)
  } finally {
    try {
      await prisma.$disconnect()
    } catch (e) {
      // ignore disconnect errors
    }
  }
})()
