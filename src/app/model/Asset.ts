import { Tag } from './Tag';
import { Category } from './Category';

export interface Asset {
  url: string;
  thumbnail?: string;
  title?: string;
  tags: string[];
  category: string;
  size?: number;
  dimensions?: Dimension;
  rating?: number;
  format?: string;
  _id?: string
}

export interface Dimension {
  width: number;
  height: number;
}
