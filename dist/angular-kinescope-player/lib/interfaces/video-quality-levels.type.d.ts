import { VideoQuality } from './video-quality.type';
export declare type VideoQualityLevels = {
    [quality in VideoQuality]: {
        level: number;
        url?: string;
    };
};
