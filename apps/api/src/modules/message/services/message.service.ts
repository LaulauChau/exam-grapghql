import { BadRequestException, Injectable } from "@nestjs/common";

import { DatabaseService } from "~/database/services/database.service";

@Injectable()
export class MessageService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(content: string, roomId: string, userId: string) {
    const existingRoom = await this.databaseService.room.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) {
      throw new BadRequestException("Room does not exist");
    }

    const existingUser = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new BadRequestException("User does not exist");
    }

    return this.databaseService.message.create({
      data: {
        content,
        room: { connect: { id: roomId } },
        user: { connect: { id: userId } },
      },
      include: { room: true, user: true },
    });
  }

  async findOne(messageId: string) {
    return this.databaseService.message.findUnique({
      where: { id: messageId },
      include: { room: true, user: true },
    });
  }

  async findMany(roomId: string) {
    const existingRoom = await this.databaseService.room.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) {
      throw new BadRequestException("Room does not exist");
    }

    return this.databaseService.message.findMany({
      where: { roomId },
      include: { room: true, user: true },
    });
  }
}
