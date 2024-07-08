import { type WebhookEvent } from "@clerk/clerk-sdk-node";
import { BadRequestException, Controller, Post, Req } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { Webhook } from "svix";

import { UserService } from "~/modules/user/services/user.service";

@Controller()
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Post("/api/webhooks")
  async handleClerkWebhook(@Req() req: Request) {
    const headers = req.headers;
    const payload = JSON.stringify(req.body);

    const svix_id = headers["svix-id"] as string;
    const svix_timestamp = headers["svix-timestamp"] as string;
    const svix_signature = headers["svix-signature"] as string;

    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw new BadRequestException("Missing required headers");
    }

    const wh = new Webhook(this.configService.getOrThrow("WEBHOOK_SECRET"));
    let evt: WebhookEvent;

    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (error: unknown) {
      console.log("Error verifying webhook:", error);

      throw new BadRequestException("Invalid webhook signature");
    }

    const { data, type } = evt;

    if (type === "user.created") {
      const { id, email_addresses, first_name, last_name } = data;
      const primaryEmail = email_addresses[0]?.email_address;
      const fullName = `${first_name} ${last_name}`;

      if (!id || !primaryEmail) {
        throw new BadRequestException("Missing required data");
      }

      try {
        await this.userService.create(id, primaryEmail, fullName);
      } catch (error: unknown) {
        console.error("Error creating user:", error);
      }
    }

    if (type === "user.updated") {
      const { id, email_addresses, first_name, last_name } = data;
      const primaryEmail = email_addresses[0]?.email_address;
      const fullName = `${first_name} ${last_name}`;

      if (!id || !primaryEmail) {
        throw new BadRequestException("Missing required data");
      }

      try {
        await this.userService.update(id, primaryEmail, fullName);
      } catch (error: unknown) {
        console.error("Error updating user:", error);
      }
    }

    if (type === "user.deleted") {
      const { id } = data;

      if (!id) {
        throw new BadRequestException("Missing required data");
      }

      try {
        await this.userService.remove(id);
      } catch (error: unknown) {
        console.error("Error deleting user:", error);
      }
    }

    return true;
  }
}
