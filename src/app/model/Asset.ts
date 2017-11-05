import { Tag } from './Tag';
import { Category } from './Category';

export interface asset {
  url: string;
  title: string;
  tags: string[];
  category: string;
  size: number;
  dimensions: Dimension;
  monochrome: boolean;
  format: string;
  _id: string
}

export interface Dimension {
  width: number;
  height: number;
}

export class Asset {
  public url: string;
  public title: string;
  public tags: string[];
  public category: string;
  public size: number;
  public dimensions: Dimension;
  public monochrome: boolean;
  public format: string;
  public id: string;

  constructor(url: string, category: string, tags: string[], title?: string, size?: number, dimensions?: Dimension, monochrome?: boolean, format?: string, id?: string) {
    this.url = url;
    this.category = category;
    this.tags = tags;
    this.title = title;
    this.size = size;
    this.dimensions = dimensions;
    this.monochrome = monochrome;
    this.format = format;
    this.id = id;
  }

  public get(): asset {
    return {
      url: this.url,
      title: this.title,
      tags: this.tags,
      category: this.category,
      size: this.size,
      dimensions: this.dimensions,
      monochrome: this.monochrome,
      format: this.format,
      _id: this.id
    } as asset;
  }

  public set(asset: asset): void {
    this.url = asset.url;
    this.title = asset.title;
    this.tags = asset.tags;
    this.category = asset.category;
    this.size = asset.size;
    this.monochrome = asset.monochrome;
    this.format = asset.format;
    this.id = asset._id;
  }
}
