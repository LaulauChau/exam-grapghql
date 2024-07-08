import { Injectable } from "@nestjs/common";

import { DatabaseService } from "~/database/services/database.service";

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(id: string, email: string, name?: string) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    return this.databaseService.user.create({
      data: {
        id,
        email,
        name,
      },
    });
  }

  async findMany() {
    return this.databaseService.user.findMany({
      include: { messages: true, rooms: true },
    });
  }

  async update(id: string, email: string, name?: string) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    return this.databaseService.user.update({
      where: { id },
      data: {
        email,
        name,
      },
    });
  }

  async remove(id: string) {
    const existingUser = await this.databaseService.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User does not exist");
    }

    return this.databaseService.user.delete({
      where: { id },
    });
  }
}
