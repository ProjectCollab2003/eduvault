export class User {
  constructor({ user_id, role_id, role_name, grade_id, grade_name, name, email, password, created_at }) {
    this.user_id = user_id;
    this.role_id = role_id;
    this.role_name = role_name;
    this.grade_id = grade_id ? Number(grade_id) : null;
    this.grade_name = grade_name || null;
    this.name = name;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
  }

  // Returns safe user object without password hash
  toSafeObject() {
    const { password, ...safeData } = this;
    return safeData;
  }
}
