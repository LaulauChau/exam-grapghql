import { verifyToken } from "@clerk/clerk-sdk-node";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    try {
      await verifyToken(request.cookies.__session, {
        secretKey: this.configService.getOrThrow("CLERK_SECRET_KEY"),
      });
    } catch (error: unknown) {
      this.logger.error(error);
      return false;
    }

    return true;
  }
}
