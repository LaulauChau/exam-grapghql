import { Query, Resolver } from "@nestjs/graphql";

import { User } from "~/modules/user/entities/user.entity";
import { UserService } from "~/modules/user/services/user.service";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.findMany();
  }
}
