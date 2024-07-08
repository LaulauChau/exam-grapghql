import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateMessageInput {
  @Field()
  content!: string;

  @Field()
  roomId!: string;

  @Field()
  userId!: string;
}
