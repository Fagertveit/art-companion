import { Dimension, Tag } from './';

export interface File {
  category: string;
  destination: string;
  dimensions: Dimension;
  filename: string;
  format: string;
  size: number;
  tags: Tag[];
  url: string
}

export interface FileSystem {
  [index: string]: File[];
}
