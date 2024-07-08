import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { WsAdapter } from "@nestjs/platform-ws";
import cookieParser from "cookie-parser";

import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    credentials: true,
    origin: "*",
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useWebSocketAdapter(new WsAdapter(app));

  await app.listen(configService.getOrThrow("SERVER_PORT"));
  console.log(
    `Server running on http://localhost:${configService.getOrThrow(
      "SERVER_PORT",
    )}`,
  );
}

bootstrap();
