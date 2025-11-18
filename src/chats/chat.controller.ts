import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common'
import { ChatService } from './chat.service'

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('health')
  health() {
    return { status: 'ok' }
  }

  @Get('messages')
  async getMessages() {
    return this.chatService.findMessages()
  }

  @Post('message')
  async createMessage(@Body() body: { text: string; email: string; name?: string }) {
    const { text, email, name } = body
    return this.chatService.createMessage({ text, email, name })
  }

  @Post()
  async createChat(@Body() body: { name: string; description?: string; participants: string[] }) {
    return this.chatService.createChat(body)
  }

  @Get()
  async getChats() {
    return this.chatService.getChats()
  }

  @Patch(':id')
  async updateChat(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.chatService.updateChat(id, body)
  }
}
