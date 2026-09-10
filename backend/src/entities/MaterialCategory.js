export class MaterialCategory {
  constructor({ category_id, name, description, material_count }) {
    this.category_id = category_id;
    this.name = name;
    this.description = description;
    if (material_count !== undefined) {
      this.material_count = Number(material_count);
    }
  }
}
