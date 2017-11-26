import { SketchSeries } from './SketchSeries';

export interface Sketch {
  title: string;
  assetSource: number;
  assetSourceId: string;
  series: SketchSeries[];
  _id?: string
}
