export class Notification {
  constructor({ notification_id, user_id, title, message, is_read, created_at }) {
    this.notification_id = notification_id;
    this.user_id = user_id;
    this.title = title;
    this.message = message;
    this.is_read = Boolean(is_read);
    this.created_at = created_at;
  }
}
