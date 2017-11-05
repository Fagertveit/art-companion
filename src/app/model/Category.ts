export interface category {
  title: string;
  description?: string;
  icon?: string;
  _id?: string;
}

export class Category {
  public title: string;
  public description: string;
  public icon: string;
  public id: string;

  constructor(title?: string, description?: string, icon?: string, id?: string) {
    this.title = title;
    this.description = description;
    this.icon = icon;
    this.id = id;
  }

  public get(): category {
    return {
      title: this.title,
      description: this.description,
      icon: this.icon,
      _id: this.id
    } as category;
  }

  public set(category: category) {
    this.title = category.title;
    this.description = category.description;
    this.icon = category.icon;
    this.id = category._id;
  }
}
