import { BadRequestException, Injectable } from "@nestjs/common";

import { DatabaseService } from "~/database/services/database.service";

@Injectable()
export class RoomService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userIds: string[], name?: string) {
    if (userIds.length < 2) {
      throw new BadRequestException("A room must have at least two users");
    }

    const existingUsers = await this.databaseService.user.findMany({
      where: { id: { in: userIds } },
    });

    if (existingUsers.length !== userIds.length) {
      throw new BadRequestException("One or more users do not exist");
    }

    return this.databaseService.room.create({
      data: {
        name,
        users: {
          connect: userIds.map((id) => ({ id })),
        },
      },
      include: { messages: true, users: true },
    });
  }

  async findOne(id: string) {
    return this.databaseService.room.findUnique({
      where: { id },
      include: { messages: true, users: true },
    });
  }

  async findMany(userId: string) {
    return this.databaseService.room.findMany({
      where: { users: { some: { id: userId } } },
      include: { messages: true, users: true },
    });
  }

  async delete(id: string) {
    return this.databaseService.room.delete({ where: { id } });
  }
}
