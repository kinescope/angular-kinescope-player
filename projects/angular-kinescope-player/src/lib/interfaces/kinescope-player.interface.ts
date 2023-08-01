import { VideoQuality } from './video-quality.type';
import { PlaylistItemOptions } from './playlistItem-options.interface';
import { KinescopePlayerEvent } from '../constants';

export interface KinescopePlayer {
  on: (event: KinescopePlayerEvent, callback: any) => void;
  once: (event: KinescopePlayerEvent, callback: any) => void;
  off: (event: KinescopePlayerEvent, callback: any) => void;
  Events: typeof KinescopePlayerEvent;
  isPaused(): Promise<boolean>;
  isEnded(): Promise<boolean>;
  play(): Promise<void>;
  pause(): Promise<boolean>;
  stop(): Promise<void>;
  getCurrentTime(): Promise<number>;
  getDuration(): Promise<number>;
  seekTo(time: number): Promise<void>;
  isMuted(): Promise<boolean>;
  mute(): Promise<void>;
  unmute(): Promise<void>;
  getVolume(): Promise<number>;
  setVolume(value: number): Promise<void>;
  getPlaybackRate(): Promise<number>;
  setPlaybackRate(value: number): Promise<void>;
  getVideoQualityList(): Promise<VideoQuality[]>;
  getCurrentVideoQuality(): Promise<VideoQuality>;
  setVideoQuality(quality: VideoQuality): Promise<void>;
  enableTextTrack(lang: string): Promise<void>;
  disableTextTrack(): Promise<void>;
  closeCTA(): Promise<void>;
  isFullscreen(): Promise<boolean>;
  setFullscreen(fullscreen: boolean): Promise<void>;
  setPlaylistItemOptions(options: PlaylistItemOptions): Promise<void>;
  destroy(): Promise<void>;
}
