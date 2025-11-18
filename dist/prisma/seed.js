"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const user = await prisma.user.upsert({
        where: { email: 'admin@local' },
        update: {},
        create: { username: 'admin', email: 'admin@local' },
    });
    console.log('Seeded user:', user.email);
}
(async () => {
    try {
        await main();
    }
    catch (e) {
        console.error('Seed error:', e);
    }
    finally {
        try {
            await prisma.$disconnect();
        }
        catch (e) {
        }
    }
})();
//# sourceMappingURL=seed.js.map