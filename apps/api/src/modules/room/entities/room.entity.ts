import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Message } from "~/modules/message/entities/message.entity";
import { User } from "~/modules/user/entities/user.entity";

@ObjectType()
export class Room {
  @Field(() => ID)
  id!: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field(() => [User])
  users!: User[];
}
