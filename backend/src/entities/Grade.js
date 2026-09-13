export class Grade {
  constructor({ grade_id, name, description, subject_count, material_count }) {
    this.grade_id = grade_id;
    this.name = name;
    this.description = description;
    this.subject_count = subject_count !== undefined ? Number(subject_count) : 0;
    this.material_count = material_count !== undefined ? Number(material_count) : 0;
  }
}
