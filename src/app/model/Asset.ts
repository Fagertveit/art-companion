import { Tag } from './Tag';
import { Category } from './Category';

export interface Asset {
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
