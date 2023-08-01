import { VideoQuality } from './video-quality.type';

export type VideoQualityLevels = {
  [quality in VideoQuality]: {
    level: number;
    url?: string;
  };
};
