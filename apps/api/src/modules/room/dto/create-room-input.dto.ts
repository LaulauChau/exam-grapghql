import { Field, InputType } from "@nestjs/graphql";
import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateRoomInput {
  @Field()
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(2, { message: "At least 2 users are required" })
  userIds!: string[];
}
