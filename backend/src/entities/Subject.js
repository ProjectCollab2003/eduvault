export class Subject {
  constructor({ subject_id, grade_id, grade_name, name, description, material_count }) {
    this.subject_id = subject_id;
    this.grade_id = grade_id;
    this.grade_name = grade_name;
    this.name = name;
    this.description = description;
    if (material_count !== undefined) {
      this.material_count = Number(material_count);
    }
  }
}
