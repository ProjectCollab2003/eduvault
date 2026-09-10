export class Announcement {
  constructor({
    announcement_id,
    admin_id,
    admin_name,
    title,
    message,
    published_at,
    created_at,
  }) {
    this.announcement_id = announcement_id;
    this.admin_id = admin_id;
    this.admin_name = admin_name;
    this.title = title;
    this.message = message;
    this.published_at = published_at;
    this.created_at = created_at;
  }
}
