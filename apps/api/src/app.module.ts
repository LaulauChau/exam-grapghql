import { join } from "node:path";
import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";

import { MessageModule } from "./modules/message/message.module";
import { RoomModule } from "./modules/room/room.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(process.cwd(), "../../.env"),
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: join(
          process.cwd(),
          "../../packages/graphql/src/schema.graphql",
        ),
        context: ({ req, res }: { req: Request; res: Response }) => ({
          req,
          res,
        }),
        cors: {
          credentials: true,
          origin: configService.getOrThrow("CLIENT_URL"),
        },
        installSubscriptionHandlers: true,
        playground: true,
        sortSchema: true,
        subscriptions: {
          "graphql-ws": true,
          "subscriptions-transport-ws": true,
        },
      }),
    }),
    ServeStaticModule.forRoot({
      exclude: ["/api*"],
      rootPath: join(__dirname, "..", "..", "web", "dist"),
    }),
    MessageModule,
    RoomModule,
    UserModule,
  ],
})
export class AppModule {}
