import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { clone, isEqual } from 'lodash';

import {
  EventCallActionTypes,
  EventCallBookmarkTypes,
  EventDurationChangeTypes,
  EventErrorTypes,
  EventFullscreenChangeTypes,
  EventPlaybackRateChangeTypes,
  EventProgressTypes,
  EventQualityChangedTypes,
  EventReadyTypes,
  EventSeekChapterTypes,
  EventSizeChangedTypes,
  EventTimeUpdateTypes,
  EventVolumeChangeTypes,
  KinescopeCreateOptions,
  KinescopePlayer,
  KinescopePlayerConfig,
  PlaylistItemOptions,
  VideoQuality,
  ActionType,
} from '../interfaces';
import { KINESCOPE_DEFAULT_CONFIG, KinescopePlayerEvent, VIDEO_HOST } from '../constants';

import { KinescopeLoaderComponent } from './kinescope-loader.component';

let index = 1;

type EventListTypes = [KinescopePlayerEvent, (v?: ActionType) => Promise<void> | void][];

@Component({
  selector: 'kinescope-player',
  template: `
    <kinescope-loader (onJSLoad)="handleJSLoad()" (onJSLoadError)="_config.onJSLoadError?.()">
      <span #parentsRef [ngClass]="_config.className" [ngStyle]="_config.style"></span>
    </kinescope-loader>
  `,
  standalone: true,
  imports: [KinescopeLoaderComponent, CommonModule],
})
export class KinescopePlayerComponent implements OnDestroy {
  @Input() set config(config: KinescopePlayerConfig) {
    if (this._config) {
      const previous = clone(this._config);
      this._config = Object.assign({ ...KINESCOPE_DEFAULT_CONFIG }, config);
      this.shouldPlayerUpdate(previous);
      this.shouldPlaylistUpdate(previous);
    } else {
      this._config = Object.assign({ ...KINESCOPE_DEFAULT_CONFIG }, config);
    }
  }

  _config: KinescopePlayerConfig;

  private document = inject(DOCUMENT);
  private renderer2 = inject(Renderer2);
  private playerLoad = false;
  private player: KinescopePlayer;
  private getNextPlayerId = (): string => `__kinescope_player_${this.getNextIndex()}`;
  private getNextIndex = (): number => index++;

  @ViewChild('parentsRef', { read: ElementRef }) parentsRef: ElementRef<unknown>;

  isPaused = (): Promise<boolean> => this.player?.isPaused() || Promise.reject(null);
  isEnded = (): Promise<boolean> => this.player?.isEnded() || Promise.reject(null);
  play = (): Promise<void> => this.player?.play() || Promise.reject(null);
  pause = (): Promise<boolean> => this.player?.pause() || Promise.reject(null);
  stop = (): Promise<void> => this.player?.stop() || Promise.reject(null);
  getCurrentTime = (): Promise<number> => this.player?.getCurrentTime() || Promise.reject(null);
  getDuration = (): Promise<number> => this.player?.getDuration() || Promise.reject(null);
  seekTo = (time: number): Promise<void> => this.player?.seekTo(time) || Promise.reject(null);
  isMuted = (): Promise<boolean> => this.player?.isMuted() || Promise.reject(null);
  mute = (): Promise<void> => this.player?.mute() || Promise.reject(null);
  unmute = (): Promise<void> => this.player?.unmute() || Promise.reject(null);
  getVolume = (): Promise<number> => this.player?.getVolume() || Promise.reject(null);
  setVolume = (value: number): Promise<void> => this.player?.setVolume(value) || Promise.reject(null);
  getPlaybackRate = (): Promise<number> => this.player?.getPlaybackRate() || Promise.reject(null);
  setPlaybackRate = (value: number): Promise<void> => this.player?.setPlaybackRate(value) || Promise.reject(null);
  getVideoQualityList = (): Promise<VideoQuality[]> => this.player?.getVideoQualityList() || Promise.reject(null);
  getCurrentVideoQuality = (): Promise<VideoQuality> => this.player?.getCurrentVideoQuality() || Promise.reject(null);
  setVideoQuality = (quality: VideoQuality): Promise<void> => this.player?.setVideoQuality(quality) || Promise.reject(null);
  enableTextTrack = (lang: string): Promise<void> => this.player?.enableTextTrack(lang) || Promise.reject(null);
  disableTextTrack = (): Promise<void> => this.player?.disableTextTrack() || Promise.reject(null);
  closeCTA = (): Promise<void> => this.player?.closeCTA() || Promise.reject(null);
  isFullscreen = (): Promise<boolean> => this.player?.isFullscreen() || Promise.reject(null);
  setFullscreen = (fullscreen: boolean): Promise<void> => this.player?.setFullscreen(fullscreen) || Promise.reject(null);

  async handleJSLoad(): Promise<void> {
    if (this.playerLoad) {
      return;
    }
    this.playerLoad = true;
    this._config.onJSLoad?.();
    debugger;
    await this.create();
  };

  ngOnDestroy(): void {
    this._config?.onDestroy?.();
  }

  private async shouldPlayerUpdate(prevProps: KinescopePlayerConfig): Promise<void> {
    const {
      videoId,
      query,
      width,
      height,
      autoPause,
      autoPlay,
      loop,
      muted,
      playsInline,
      language,
      controls,
      mainPlayButton,
      playbackRateButton,
      watermark,
      localStorage,
    } = this._config;

    if (muted !== prevProps.muted) {
      muted ? await this.mute() : await this.unmute();
    }

    if (
      videoId !== prevProps.videoId ||
      !isEqual(query, prevProps.query) ||
      width !== prevProps.width ||
      height !== prevProps.height ||
      autoPause !== prevProps.autoPause ||
      autoPlay !== prevProps.autoPlay ||
      loop !== prevProps.loop ||
      playsInline !== prevProps.playsInline ||
      language !== prevProps.language ||
      controls !== prevProps.controls ||
      mainPlayButton !== prevProps.mainPlayButton ||
      playbackRateButton !== prevProps.playbackRateButton ||
      !isEqual(watermark, prevProps.watermark) ||
      !isEqual(localStorage, prevProps.localStorage)
    ) {
      await this.create();
    }
  };

  private async shouldPlaylistUpdate(prevProps: KinescopePlayerConfig): Promise<void> {
    const { title, subtitle, poster, chapters, vtt, bookmarks, actions, drmAuthToken } = this._config;

    if (title !== prevProps.title) {
      await this.updateTitleOptions();
    }

    if (poster !== prevProps.poster) {
      await this.updatePosterOptions();
    }

    if (subtitle !== prevProps.subtitle) {
      await this.updateSubtitleOptions();
    }

    if (drmAuthToken !== prevProps.drmAuthToken) {
      await this.updateDrmAuthTokenOptions();
    }

    if (!isEqual(chapters, prevProps.chapters)) {
      await this.updateChaptersOptions();
    }

    if (!isEqual(vtt, prevProps.vtt)) {
      await this.updateVttOptions();
    }

    if (!isEqual(bookmarks, prevProps.bookmarks)) {
      await this.updateBookmarksOptions();
    }

    if (!isEqual(actions, prevProps.actions)) {
      await this.updateActionsOptions();
    }
  };

  private async updateTitleOptions(): Promise<void> {
    await this.setPlaylistItemOptions({ title: this._config.title });
  };

  private async updatePosterOptions(): Promise<void> {
    await this.setPlaylistItemOptions({ poster: this._config.poster });
  };

  private async updateSubtitleOptions(): Promise<void> {
    await this.setPlaylistItemOptions({ subtitle: this._config.subtitle });
  };

  private async updateDrmAuthTokenOptions(): Promise<void> {
    await this.setPlaylistItemOptions({ drm: { auth: { token: this._config.drmAuthToken } } });
  };

  private async updateChaptersOptions(): Promise<void> {
    await this.setPlaylistItemOptions({ chapters: this._config.chapters });
  };

  private async updateVttOptions(): Promise<void> {
    await this.setPlaylistItemOptions({ vtt: this._config.vtt });
  };

  private async updateBookmarksOptions(): Promise<void> {
    await this.setPlaylistItemOptions({ bookmarks: this._config.bookmarks });
  };

  private async updateActionsOptions(): Promise<void> {
    await this.setPlaylistItemOptions({ actions: this._config.actions });
  };

  private async readyPlaylistOptions(): Promise<void> {
    const { title, subtitle, poster, chapters, vtt, bookmarks, actions, drmAuthToken } = this._config;
    const options: PlaylistItemOptions = {};

    options.title = title ?? undefined;
    options.subtitle = subtitle ?? undefined;
    options.poster = poster ?? undefined;
    options.chapters = chapters ?? undefined;
    options.vtt = vtt ?? undefined;
    options.bookmarks = bookmarks ?? undefined;
    options.actions = actions ?? undefined;
    options.drm = drmAuthToken ? { auth: { token: drmAuthToken } } : undefined;

    await this.setPlaylistItemOptions(options);
  };

  private async create(): Promise<void> {
    await this.destroy();

    const parentsRef = this.parentsRef.nativeElement;
    if (!this.playerLoad || !parentsRef) {
      return;
    }

    /* create playerId */
    this.renderer2.setProperty(parentsRef, 'textContent', '');
    const playerId = this.getNextPlayerId();
    const playerDiv = this.renderer2.createElement('div');
    this.renderer2.setAttribute(playerDiv, 'id', playerId);
    this.renderer2.appendChild(parentsRef, playerDiv);
    /* fast re create player fix */
    await new Promise(resolve => setTimeout(resolve, 0));
    if (!this.document.getElementById(playerId)) {
      return;
    }

    this.player = await this.createPlayer(playerId);
    debugger;
    this.getEventList().forEach(event => this.player?.on(event[0], event[1]));
  };

  private async destroy(): Promise<void> {
    if (!this.player) {
      return;
    }
    await this.player.destroy();
    this.player = null;
  };

  private getEventList(): EventListTypes {
    const events = this.player?.Events;
    if (!events) {
      return [];
    }
    return [
      [events.Ready, (event: ActionType) => this.handleEventReady(event)],
      [events.Destroy, () => this._config?.onDestroy?.()],
      [events.Play, () => this._config?.onPlay?.()],
      [events.Playing, () => this._config?.onPlaying?.()],
      [events.Waiting, () => this._config?.onWaiting?.()],
      [events.Pause, () => this._config?.onPause?.()],
      [events.Ended, () => this._config?.onEnded?.()],
      [events.QualityChanged, (event: ActionType) => this._config?.onQualityChanged?.(event.data as EventQualityChangedTypes)],
      [events.AutoQualityChanged, (event: ActionType) => this._config?.onAutoQualityChanged?.(event.data as EventQualityChangedTypes)],
      [events.SeekChapter, (event: ActionType) => this._config?.onSeekChapter?.(event.data as EventSeekChapterTypes)],
      [events.SizeChanged, (event: ActionType) => this._config?.onSizeChanged?.(event.data as EventSizeChangedTypes)],
      [events.TimeUpdate, (event: ActionType) => this._config?.onTimeUpdate?.(event.data as EventTimeUpdateTypes)],
      [events.Progress, (event: ActionType) => this._config?.onProgress?.(event.data as EventProgressTypes)],
      [events.DurationChange, (event: ActionType) => this._config?.onDurationChange?.(event.data as EventDurationChangeTypes)],
      [events.VolumeChange, (event: ActionType) => this._config?.onVolumeChange?.(event.data as EventVolumeChangeTypes)],
      [events.PlaybackRateChange, (event: ActionType) => this._config?.onPlaybackRateChange?.(event.data as EventPlaybackRateChangeTypes)],
      [events.Seeking, () => this._config?.onSeeking?.()],
      [events.FullscreenChange, (event: ActionType) => this._config?.onFullscreenChange?.(event.data as EventFullscreenChangeTypes)],
      [events.CallAction, (event: ActionType) => this._config?.onCallAction?.(event.data as EventCallActionTypes)],
      [events.CallBookmark, (event: ActionType) => this._config?.onCallBookmark?.(event.data as EventCallBookmarkTypes)],
      [events.Error, (event: ActionType) => this._config?.onError?.(event.data as EventErrorTypes)],
    ];
  };

  private getQueryParams(): [string, string][] {
    const params: [string, string][] = [];
    if (this._config.query?.duration) {
      params.push(['duration', this._config.query.duration.toString()]);
    }
    if (this._config.query?.seek) {
      params.push(['seek', this._config.query.seek.toString()]);
    }
    return params;
  };

  private makeURL(url: string): string {
    const _url = new URL(url);
    this.getQueryParams().forEach(function (params) {
      _url.searchParams.append(params[0], params[1]);
    });
    return _url.toString();
  };

  private getIFrameUrl(): string {
    return this.makeURL(VIDEO_HOST + this._config.videoId);
  };

  private createPlayer(playerId: string): Promise<KinescopePlayer> {
    const {
      title,
      subtitle,
      poster,
      chapters,
      vtt,
      externalId,
      drmAuthToken,
      width,
      height,
      autoPause,
      autoPlay,
      loop,
      muted,
      playsInline,
      language,
      controls,
      mainPlayButton,
      playbackRateButton,
      bookmarks,
      actions,
      watermark,
      localStorage,
    } = this._config;

    const options: KinescopeCreateOptions = {
      url: this.getIFrameUrl(),
      size: { width: width, height: height },
      behaviour: {
        autoPause: autoPause,
        autoPlay: autoPlay,
        loop: loop,
        muted: muted,
        playsInline: playsInline,
        localStorage: localStorage,
      },
      playlist: [
        {
          title: title,
          subtitle: subtitle,
          poster: poster,
          chapters: chapters,
          vtt: vtt,
          bookmarks: bookmarks,
          actions: actions,
          drm: {
            auth: {
              token: drmAuthToken,
            },
          },
        },
      ],
      ui: {
        language: language,
        controls: controls,
        mainPlayButton: mainPlayButton,
        playbackRateButton: playbackRateButton,
        watermark: watermark,
      },
      settings: {
        externalId: externalId,
      },
    };

    return window.Kinescope.IframePlayer.create(playerId, options);
  };

  private async setPlaylistItemOptions(options: PlaylistItemOptions): Promise<void> {
    if (!this.player) {
      return Promise.resolve();
    }
    await this.player.setPlaylistItemOptions(options);
  };

  private async handleEventReady(event: ActionType): Promise<void> {
    await this.readyPlaylistOptions();
    this._config?.onReady?.(event.data as EventReadyTypes);
  };
}
