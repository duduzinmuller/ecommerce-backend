export interface EmailNotification {
  id: string;
  recipient: string;
  subject: string;
  content: string;
  sent_at: Date;
  status: SendStatus;
  created_at: Date;
  updated_at: Date;
}

type SendStatus = "pending" | "sent" | "failed";
