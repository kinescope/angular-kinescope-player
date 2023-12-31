import { WatermarkModeTypes } from './watermark-mode-types.type';

export type WatermarkTypes = | string | {
  text: string;
  mode?: WatermarkModeTypes;
  scale?: number;
  displayTimeout?: number | {visible: number; hidden: number};
};
