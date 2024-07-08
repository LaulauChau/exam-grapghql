import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Room } from "~/modules/room/entities/room.entity";
import { User } from "~/modules/user/entities/user.entity";

@ObjectType()
export class Message {
  @Field(() => ID)
  id!: string;

  @Field()
  content!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => User)
  user!: User;

  @Field(() => Room)
  room!: Room;
}
