import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CreateRoomInput } from "~/modules/room/dto/create-room-input.dto";
import { Room } from "~/modules/room/entities/room.entity";
import { RoomService } from "~/modules/room/services/room.service";

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Query(() => Room)
  async room(@Args("id") id: string) {
    return this.roomService.findOne(id);
  }

  @Query(() => [Room])
  async rooms(@Args("userId") userId: string) {
    return this.roomService.findMany(userId);
  }

  @Mutation(() => Room)
  async createRoom(@Args("createRoomInput") input: CreateRoomInput) {
    return this.roomService.create(input.userIds, input.name);
  }

  @Mutation(() => Room)
  async deleteRoom(@Args("id") id: string) {
    return this.roomService.delete(id);
  }
}
