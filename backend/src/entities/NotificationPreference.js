export class NotificationPreference {
  constructor({ preference_id, user_id, subject_id, subject_name, grade_name, enabled }) {
    this.preference_id = preference_id;
    this.user_id = user_id;
    this.subject_id = subject_id;
    this.subject_name = subject_name;
    this.grade_name = grade_name;
    this.enabled = Boolean(enabled);
  }
}
