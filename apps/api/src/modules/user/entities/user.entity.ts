import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Message } from "~/modules/message/entities/message.entity";
import { Room } from "~/modules/room/entities/room.entity";

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => [Room], { nullable: true })
  rooms?: Room[];

  @Field(() => [Message], { nullable: true })
  messages?: Message[];
}
