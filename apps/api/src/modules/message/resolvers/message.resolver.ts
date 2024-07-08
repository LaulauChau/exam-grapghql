import { AmqpConnection, RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";

import { CreateMessageInput } from "~/modules/message/dto/create-message-input.do";
import { Message } from "~/modules/message/entities/message.entity";
import { MessageService } from "~/modules/message/services/message.service";

const pubSub = new PubSub();

@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly messageService: MessageService,
  ) {}

  @Query(() => [Message])
  async messages(@Args("roomId") roomId: string) {
    return this.messageService.findMany(roomId);
  }

  @Mutation(() => Message)
  async createMessage(@Args("createMessageInput") input: CreateMessageInput) {
    const newMessage = await this.messageService.create(
      input.content,
      input.roomId,
      input.userId,
    );

    await this.amqpConnection.publish("message_exchange", "message_created", {
      id: newMessage.id,
      roomId: newMessage.roomId,
    });

    return newMessage;
  }

  @Subscription(() => Message, {
    filter: (payload, variables) =>
      payload.messageCreated.roomId === variables.roomId,
  })
  messageCreated(@Args("roomId") roomId: string) {
    return pubSub.asyncIterator(`message_created:${roomId}`);
  }

  @RabbitSubscribe({
    exchange: "message_exchange",
    routingKey: "message_created",
    queue: "message_queue",
  })
  async messageCreatedHandler(data: { id: string; roomId: string }) {
    const message = await this.messageService.findOne(data.id);

    await pubSub.publish(`message_created:${data.roomId}`, {
      messageCreated: message,
    });
  }
}
