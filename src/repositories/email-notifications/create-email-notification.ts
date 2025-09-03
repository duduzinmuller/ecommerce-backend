import { db } from "../../db";
import { email_notifications } from "../../db/schema";
import { EmailNotification } from "../../interfaces/email-notification";

export class CreateEmailNotificationRepository {
  async execute(createEmailNotificationParams: EmailNotification) {
    const emailNotification = await db
      .insert(email_notifications)
      .values({
        id: createEmailNotificationParams.id,
        recipient: createEmailNotificationParams.recipient,
        subject: createEmailNotificationParams.subject,
        content: createEmailNotificationParams.content,
        sent_at: createEmailNotificationParams.sent_at,
      })
      .returning();

    return emailNotification;
  }
}
