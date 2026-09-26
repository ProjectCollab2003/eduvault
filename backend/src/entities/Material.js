export class Material {
  constructor({
    material_id,
    subject_id,
    subject_name,
    grade_id,
    grade_name,
    category_id,
    category_name,
    title,
    description,
    academic_year,
    term,
    file_url,
    public_id,
    thumbnail_url,
    resource_type,
    download_count,
    view_count,
    created_at,
  }) {
    this.material_id = material_id;
    this.subject_id = subject_id;
    this.subject_name = subject_name;
    this.grade_id = grade_id;
    this.grade_name = grade_name;
    this.category_id = category_id;
    this.category_name = category_name;
    this.title = title;
    this.description = description;
    this.academic_year = academic_year ? Number(academic_year) : null;
    this.term = term ? Number(term) : null;
    this.file_url = file_url;
    this.public_id = public_id;
    this.thumbnail_url = thumbnail_url;
    this.resource_type = resource_type || "raw";
    this.download_count = Number(download_count || 0);
    this.view_count = Number(view_count || 0);
    this.created_at = created_at;
  }
}
