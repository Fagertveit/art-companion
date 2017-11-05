export interface tag {
  title: string;
  _id?: string;
  description?: string;
  parentCategory?: string;
  parentTag?: string;
}

export class Tag {
  public title: string;
  public id: string;
  public description: string;
  public parentCategory: string;
  public parentTag: string;

  constructor(title?: string, description?: string, parentCategory?: string, parentTag?: string, id?: string) {
    this.title = title;
    this.description = description;
    this.parentCategory = parentCategory;
    this.parentTag = parentTag;
    this.id = id;
  }

  public get(): tag {
    return {
      title: this.title,
      description: this.description,
      parentCategory: this.parentCategory,
      parentTag: this.parentTag,
      _id: this.id
    } as tag;
  }

  public set(tag: tag): void {
    this.title = tag.title;
    this.description = tag.description;
    this.parentCategory = tag.parentCategory;
    this.parentTag = tag.parentTag;
    this.id = tag._id;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }
}
