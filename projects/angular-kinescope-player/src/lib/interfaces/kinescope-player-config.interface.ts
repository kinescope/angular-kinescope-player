import { KinescopePlayerEvent } from '../constants';

import { ActionToolBar } from './action-tool-bar.type';
import { ActionCallToAction } from './action-call-to-action.type';
import { WatermarkTypes } from './watermark-types.type';
import { VideoQuality } from './video-quality.type';
import { VideoQualityLevels } from './video-quality-levels.type';

type CallbackData = void |
  EventReadyTypes |
  EventQualityChangedTypes |
  EventSeekChapterTypes |
  EventSizeChangedTypes |
  EventTimeUpdateTypes |
  EventProgressTypes |
  EventDurationChangeTypes |
  EventVolumeChangeTypes |
  EventPlaybackRateChangeTypes |
  EventFullscreenChangeTypes |
  EventCallActionTypes |
  EventCallBookmarkTypes |
  EventErrorTypes;


export interface ActionType {
  type: KinescopePlayerEvent;
  data: CallbackData;
  // target: IframePlayerController;
}

export interface VttTypes {
  label: string;
  src: string;
  srcLang: string;
}

export interface ChapterTypes {
  position: number;
  title: string;
}

export type ActionsTypes = ActionToolBar | ActionCallToAction;

export interface BookmarkTypes {
  id: string;
  time: number;
  title?: string;
}

export interface EventReadyTypes {
  currentTime: number;
  duration: number;
  quality: VideoQuality;
  qualityLevels: VideoQualityLevels;
}

export interface EventQualityChangedTypes {
  quality: VideoQuality;
}

export interface EventSeekChapterTypes {
  position: number;
}

export interface EventDurationChangeTypes {
  duration: number;
}

export interface EventProgressTypes {
  bufferedTime: number;
}

export interface EventTimeUpdateTypes {
  currentTime: number;
}

export interface EventVolumeChangeTypes {
  muted: boolean;
  volume: number;
}

export interface EventPlaybackRateChangeTypes {
  playbackRate: number;
}

export interface EventSizeChangedTypes {
  width: number;
  height: number;
}

export interface EventFullscreenChangeTypes {
  isFullscreen: boolean;
  video: boolean;
}

export interface EventCallActionTypes {
  id: string;
  title?: string;
  type: string;
}

export interface EventCallBookmarkTypes {
  id: string;
  time: number;
}

export interface EventErrorTypes {
  error: unknown;
}

export interface QueryTypes {
  seek?: number;
  duration?: number;
}

export interface KinescopePlayerConfig {
  videoId: string;
  query?: QueryTypes;
  className?: string;
  style?: Record<string, string | number>;
  onJSLoad?: () => void;
  onJSLoadError?: () => void;

  title?: string;
  subtitle?: string;
  poster?: string;
  width?: number | string;
  height?: number | string;
  autoPlay?: boolean | 'viewable';
  autoPause?: boolean | 'reset';
  loop?: boolean;
  playsInline?: boolean;
  muted?: boolean;
  language?: 'ru' | 'en';
  controls?: boolean;
  mainPlayButton?: boolean;
  playbackRateButton?: boolean;
  chapters?: ChapterTypes[];
  vtt?: VttTypes[];
  externalId?: string;
  drmAuthToken?: string;
  actions?: ActionsTypes[];
  bookmarks?: BookmarkTypes[];
  watermark?: WatermarkTypes;
  localStorage?: boolean;

  onDestroy?: () => void;
  onJsLoad?: () => void;
  onPlay?: () => void;
  onPlaying?: () => void;
  onWaiting?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onReady?: (data: EventReadyTypes) => void;
  onQualityChanged?: (data: EventQualityChangedTypes) => void;
  onAutoQualityChanged?: (data: EventQualityChangedTypes) => void;
  onSeekChapter?: (data: EventSeekChapterTypes) => void;
  onSizeChanged?: (data: EventSizeChangedTypes) => void;
  onTimeUpdate?: (data: EventTimeUpdateTypes) => void;
  onProgress?: (data: EventProgressTypes) => void;
  onDurationChange?: (data: EventDurationChangeTypes) => void;
  onVolumeChange?: (data: EventVolumeChangeTypes) => void;
  onPlaybackRateChange?: (data: EventPlaybackRateChangeTypes) => void;
  onSeeking?: () => void;
  onFullscreenChange?: (data: EventFullscreenChangeTypes) => void;
  onCallAction?: (data: EventCallActionTypes) => void;
  onCallBookmark?: (data: EventCallBookmarkTypes) => void;
  onError?: (data: EventErrorTypes) => void;
}
