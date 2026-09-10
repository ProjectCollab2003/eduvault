export class Bookmark {
  constructor({
    bookmark_id,
    user_id,
    material_id,
    created_at,
    // Joined material details for convenience
    title,
    file_url,
    thumbnail_url,
    subject_name,
    grade_name,
    category_name,
  }) {
    this.bookmark_id = bookmark_id;
    this.user_id = user_id;
    this.material_id = material_id;
    this.created_at = created_at;
    this.material = title
      ? {
          material_id,
          title,
          file_url,
          thumbnail_url,
          subject_name,
          grade_name,
          category_name,
        }
      : undefined;
  }
}
