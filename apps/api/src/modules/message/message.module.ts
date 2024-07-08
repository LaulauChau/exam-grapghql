import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { DatabaseModule } from "~/database/database.module";
import { MessageResolver } from "~/modules/message/resolvers/message.resolver";
import { MessageService } from "~/modules/message/services/message.service";

@Module({
  imports: [
    DatabaseModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: "message_exchange",
            type: "topic",
          },
        ],
        uri: configService.getOrThrow("RABBITMQ_URL"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MessageService, MessageResolver],
})
export class MessageModule {}
