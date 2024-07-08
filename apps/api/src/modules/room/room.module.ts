import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/database/database.module";
import { RoomResolver } from "~/modules/room/resolvers/room.resolver";
import { RoomService } from "~/modules/room/services/room.service";

@Module({
  imports: [DatabaseModule],
  providers: [RoomService, RoomResolver],
})
export class RoomModule {}
