import { Module } from "@nestjs/common";

import { DatabaseModule } from "~/database/database.module";
import { UserController } from "./controllers/user.controller";
import { UserResolver } from "./resolvers/user.resolver";
import { UserService } from "./services/user.service";

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
