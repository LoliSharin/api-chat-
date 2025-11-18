"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
let ChatService = class ChatService {
    async findMessages() {
        return prisma.message.findMany({ include: { user: true }, orderBy: { createdAt: 'desc' } });
    }
    async createMessage({ chatId, text, email, username }) {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const uname = username || email.split('@')[0] || `user_${Math.random().toString(36).slice(2, 8)}`;
            user = await prisma.user.create({ data: { email, username: uname } });
        }
        const encrypted = Buffer.from(text || '');
        const iv = Buffer.from([]);
        const message = await prisma.message.create({
            data: {
                text,
                encryptedBody: encrypted,
                iv,
                chat: { connect: { id: chatId } },
                user: { connect: { id: user.id } },
            },
        });
        return message;
    }
    async createChat({ name, description, participants }) {
        return prisma.chat.create({
            data: {
                name,
                description,
                type: 'GROUP',
                participants: {
                    create: participants.map((id) => ({ user: { connect: { id } }, role: 'PARTICIPANT' })),
                },
            },
            include: { participants: { include: { user: true } } },
        });
    }
    async getChats() {
        return prisma.chat.findMany({ include: { participants: { include: { user: true } } } });
    }
    async updateChat(id, { name, description }) {
        return prisma.chat.update({
            where: { id },
            data: { name, description },
        });
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)()
], ChatService);
//# sourceMappingURL=chat.service.js.map