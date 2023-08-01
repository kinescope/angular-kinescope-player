import { PlaylistItemOptions } from './playlistItem-options.interface';
import { WatermarkTypes } from './watermark-types.type';
export interface KinescopeCreateOptions {
    url: string;
    size?: {
        width?: number | string;
        height?: number | string;
    };
    playlist: PlaylistItemOptions[];
    behaviour?: {
        autoPlay?: boolean | 'viewable';
        autoPause?: boolean | 'reset';
        loop?: boolean;
        playsInline?: boolean;
        muted?: boolean;
        localStorage?: boolean;
    };
    ui?: {
        language?: 'ru' | 'en';
        controls?: boolean;
        mainPlayButton?: boolean;
        playbackRateButton?: boolean;
        watermark?: WatermarkTypes;
    };
    settings?: {
        externalId?: string;
    };
}
