import { Asset } from './Asset';

export interface Collection {
  title: string;
  assets: Asset[];
  _id: string;
}
