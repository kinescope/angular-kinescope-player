import { Component, ElementRef, inject, Input, Renderer2, ViewChild, } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { clone, isEqual } from 'lodash';
import { KINESCOPE_DEFAULT_CONFIG, VIDEO_HOST } from '../constants';
import { KinescopeLoaderComponent } from './kinescope-loader.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let index = 1;
export class KinescopePlayerComponent {
    constructor() {
        this.document = inject(DOCUMENT);
        this.renderer2 = inject(Renderer2);
        this.playerLoad = false;
        this.getNextPlayerId = () => `__kinescope_player_${this.getNextIndex()}`;
        this.getNextIndex = () => index++;
        this.isPaused = () => this.player?.isPaused() || Promise.reject(null);
        this.isEnded = () => this.player?.isEnded() || Promise.reject(null);
        this.play = () => this.player?.play() || Promise.reject(null);
        this.pause = () => this.player?.pause() || Promise.reject(null);
        this.stop = () => this.player?.stop() || Promise.reject(null);
        this.getCurrentTime = () => this.player?.getCurrentTime() || Promise.reject(null);
        this.getDuration = () => this.player?.getDuration() || Promise.reject(null);
        this.seekTo = (time) => this.player?.seekTo(time) || Promise.reject(null);
        this.isMuted = () => this.player?.isMuted() || Promise.reject(null);
        this.mute = () => this.player?.mute() || Promise.reject(null);
        this.unmute = () => this.player?.unmute() || Promise.reject(null);
        this.getVolume = () => this.player?.getVolume() || Promise.reject(null);
        this.setVolume = (value) => this.player?.setVolume(value) || Promise.reject(null);
        this.getPlaybackRate = () => this.player?.getPlaybackRate() || Promise.reject(null);
        this.setPlaybackRate = (value) => this.player?.setPlaybackRate(value) || Promise.reject(null);
        this.getVideoQualityList = () => this.player?.getVideoQualityList() || Promise.reject(null);
        this.getCurrentVideoQuality = () => this.player?.getCurrentVideoQuality() || Promise.reject(null);
        this.setVideoQuality = (quality) => this.player?.setVideoQuality(quality) || Promise.reject(null);
        this.enableTextTrack = (lang) => this.player?.enableTextTrack(lang) || Promise.reject(null);
        this.disableTextTrack = () => this.player?.disableTextTrack() || Promise.reject(null);
        this.closeCTA = () => this.player?.closeCTA() || Promise.reject(null);
        this.isFullscreen = () => this.player?.isFullscreen() || Promise.reject(null);
        this.setFullscreen = (fullscreen) => this.player?.setFullscreen(fullscreen) || Promise.reject(null);
    }
    set config(config) {
        if (this._config) {
            const previous = clone(this._config);
            this._config = Object.assign({ ...KINESCOPE_DEFAULT_CONFIG }, config);
            this.shouldPlayerUpdate(previous);
            this.shouldPlaylistUpdate(previous);
        }
        else {
            this._config = Object.assign({ ...KINESCOPE_DEFAULT_CONFIG }, config);
        }
    }
    async handleJSLoad() {
        if (this.playerLoad) {
            return;
        }
        this.playerLoad = true;
        this._config.onJSLoad?.();
        debugger;
        await this.create();
    }
    ;
    ngOnDestroy() {
        this._config?.onDestroy?.();
    }
    async shouldPlayerUpdate(prevProps) {
        const { videoId, query, width, height, autoPause, autoPlay, loop, muted, playsInline, language, controls, mainPlayButton, playbackRateButton, watermark, localStorage, } = this._config;
        if (muted !== prevProps.muted) {
            muted ? await this.mute() : await this.unmute();
        }
        if (videoId !== prevProps.videoId ||
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
            !isEqual(localStorage, prevProps.localStorage)) {
            await this.create();
        }
    }
    ;
    async shouldPlaylistUpdate(prevProps) {
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
    }
    ;
    async updateTitleOptions() {
        await this.setPlaylistItemOptions({ title: this._config.title });
    }
    ;
    async updatePosterOptions() {
        await this.setPlaylistItemOptions({ poster: this._config.poster });
    }
    ;
    async updateSubtitleOptions() {
        await this.setPlaylistItemOptions({ subtitle: this._config.subtitle });
    }
    ;
    async updateDrmAuthTokenOptions() {
        await this.setPlaylistItemOptions({ drm: { auth: { token: this._config.drmAuthToken } } });
    }
    ;
    async updateChaptersOptions() {
        await this.setPlaylistItemOptions({ chapters: this._config.chapters });
    }
    ;
    async updateVttOptions() {
        await this.setPlaylistItemOptions({ vtt: this._config.vtt });
    }
    ;
    async updateBookmarksOptions() {
        await this.setPlaylistItemOptions({ bookmarks: this._config.bookmarks });
    }
    ;
    async updateActionsOptions() {
        await this.setPlaylistItemOptions({ actions: this._config.actions });
    }
    ;
    async readyPlaylistOptions() {
        const { title, subtitle, poster, chapters, vtt, bookmarks, actions, drmAuthToken } = this._config;
        const options = {};
        options.title = title ?? undefined;
        options.subtitle = subtitle ?? undefined;
        options.poster = poster ?? undefined;
        options.chapters = chapters ?? undefined;
        options.vtt = vtt ?? undefined;
        options.bookmarks = bookmarks ?? undefined;
        options.actions = actions ?? undefined;
        options.drm = drmAuthToken ? { auth: { token: drmAuthToken } } : undefined;
        await this.setPlaylistItemOptions(options);
    }
    ;
    async create() {
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
    }
    ;
    async destroy() {
        if (!this.player) {
            return;
        }
        await this.player.destroy();
        this.player = null;
    }
    ;
    getEventList() {
        const events = this.player?.Events;
        if (!events) {
            return [];
        }
        return [
            [events.Ready, (event) => this.handleEventReady(event)],
            [events.Destroy, () => this._config?.onDestroy?.()],
            [events.Play, () => this._config?.onPlay?.()],
            [events.Playing, () => this._config?.onPlaying?.()],
            [events.Waiting, () => this._config?.onWaiting?.()],
            [events.Pause, () => this._config?.onPause?.()],
            [events.Ended, () => this._config?.onEnded?.()],
            [events.QualityChanged, (event) => this._config?.onQualityChanged?.(event.data)],
            [events.AutoQualityChanged, (event) => this._config?.onAutoQualityChanged?.(event.data)],
            [events.SeekChapter, (event) => this._config?.onSeekChapter?.(event.data)],
            [events.SizeChanged, (event) => this._config?.onSizeChanged?.(event.data)],
            [events.TimeUpdate, (event) => this._config?.onTimeUpdate?.(event.data)],
            [events.Progress, (event) => this._config?.onProgress?.(event.data)],
            [events.DurationChange, (event) => this._config?.onDurationChange?.(event.data)],
            [events.VolumeChange, (event) => this._config?.onVolumeChange?.(event.data)],
            [events.PlaybackRateChange, (event) => this._config?.onPlaybackRateChange?.(event.data)],
            [events.Seeking, () => this._config?.onSeeking?.()],
            [events.FullscreenChange, (event) => this._config?.onFullscreenChange?.(event.data)],
            [events.CallAction, (event) => this._config?.onCallAction?.(event.data)],
            [events.CallBookmark, (event) => this._config?.onCallBookmark?.(event.data)],
            [events.Error, (event) => this._config?.onError?.(event.data)],
        ];
    }
    ;
    getQueryParams() {
        const params = [];
        if (this._config.query?.duration) {
            params.push(['duration', this._config.query.duration.toString()]);
        }
        if (this._config.query?.seek) {
            params.push(['seek', this._config.query.seek.toString()]);
        }
        return params;
    }
    ;
    makeURL(url) {
        const _url = new URL(url);
        this.getQueryParams().forEach(function (params) {
            _url.searchParams.append(params[0], params[1]);
        });
        return _url.toString();
    }
    ;
    getIFrameUrl() {
        return this.makeURL(VIDEO_HOST + this._config.videoId);
    }
    ;
    createPlayer(playerId) {
        const { title, subtitle, poster, chapters, vtt, externalId, drmAuthToken, width, height, autoPause, autoPlay, loop, muted, playsInline, language, controls, mainPlayButton, playbackRateButton, bookmarks, actions, watermark, localStorage, } = this._config;
        const options = {
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
    }
    ;
    async setPlaylistItemOptions(options) {
        if (!this.player) {
            return Promise.resolve();
        }
        await this.player.setPlaylistItemOptions(options);
    }
    ;
    async handleEventReady(event) {
        await this.readyPlaylistOptions();
        this._config?.onReady?.(event.data);
    }
    ;
}
KinescopePlayerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: KinescopePlayerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
KinescopePlayerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: KinescopePlayerComponent, isStandalone: true, selector: "kinescope-player", inputs: { config: "config" }, viewQueries: [{ propertyName: "parentsRef", first: true, predicate: ["parentsRef"], descendants: true, read: ElementRef }], ngImport: i0, template: `
    <kinescope-loader (onJSLoad)="handleJSLoad()" (onJSLoadError)="_config.onJSLoadError?.()">
      <span #parentsRef [ngClass]="_config.className" [ngStyle]="_config.style"></span>
    </kinescope-loader>
  `, isInline: true, dependencies: [{ kind: "component", type: KinescopeLoaderComponent, selector: "kinescope-loader", outputs: ["onJSLoad", "onJSLoadError"] }, { kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: KinescopePlayerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'kinescope-player',
                    template: `
    <kinescope-loader (onJSLoad)="handleJSLoad()" (onJSLoadError)="_config.onJSLoadError?.()">
      <span #parentsRef [ngClass]="_config.className" [ngStyle]="_config.style"></span>
    </kinescope-loader>
  `,
                    standalone: true,
                    imports: [KinescopeLoaderComponent, CommonModule],
                }]
        }], propDecorators: { config: [{
                type: Input
            }], parentsRef: [{
                type: ViewChild,
                args: ['parentsRef', { read: ElementRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNjb3BlLXBsYXllci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWtpbmVzY29wZS1wbGF5ZXIvc3JjL2xpYi9jb21wb25lbnRzL2tpbmVzY29wZS1wbGF5ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBRUwsU0FBUyxFQUNULFNBQVMsR0FDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBdUJ4QyxPQUFPLEVBQUUsd0JBQXdCLEVBQXdCLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUUxRixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7O0FBRXhFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztBQWNkLE1BQU0sT0FBTyx3QkFBd0I7SUFWckM7UUF3QlUsYUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM1QixjQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFbkIsb0JBQWUsR0FBRyxHQUFXLEVBQUUsQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUM7UUFDNUUsaUJBQVksR0FBRyxHQUFXLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUk3QyxhQUFRLEdBQUcsR0FBcUIsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRixZQUFPLEdBQUcs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SVQ7b0JBQ0QsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE9BQU8sRUFBRSxDQUFDLHdCQUF3QixFQUFFLFlBQVksQ0FBQztpQkFDbEQ7OEJBRWMsTUFBTTtzQkFBbEIsS0FBSztnQkFvQnlDLFVBQVU7c0JBQXhELFNBQVM7dUJBQUMsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgaW5qZWN0LFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUsIERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IGNsb25lLCBpc0VxdWFsIH0gZnJvbSAnbG9kYXNoJztcblxuaW1wb3J0IHtcbiAgRXZlbnRDYWxsQWN0aW9uVHlwZXMsXG4gIEV2ZW50Q2FsbEJvb2ttYXJrVHlwZXMsXG4gIEV2ZW50RHVyYXRpb25DaGFuZ2VUeXBlcyxcbiAgRXZlbnRFcnJvclR5cGVzLFxuICBFdmVudEZ1bGxzY3JlZW5DaGFuZ2VUeXBlcyxcbiAgRXZlbnRQbGF5YmFja1JhdGVDaGFuZ2VUeXBlcyxcbiAgRXZlbnRQcm9ncmVzc1R5cGVzLFxuICBFdmVudFF1YWxpdHlDaGFuZ2VkVHlwZXMsXG4gIEV2ZW50UmVhZHlUeXBlcyxcbiAgRXZlbnRTZWVrQ2hhcHRlclR5cGVzLFxuICBFdmVudFNpemVDaGFuZ2VkVHlwZXMsXG4gIEV2ZW50VGltZVVwZGF0ZVR5cGVzLFxuICBFdmVudFZvbHVtZUNoYW5nZVR5cGVzLFxuICBLaW5lc2NvcGVDcmVhdGVPcHRpb25zLFxuICBLaW5lc2NvcGVQbGF5ZXIsXG4gIEtpbmVzY29wZVBsYXllckNvbmZpZyxcbiAgUGxheWxpc3RJdGVtT3B0aW9ucyxcbiAgVmlkZW9RdWFsaXR5LFxuICBBY3Rpb25UeXBlLFxufSBmcm9tICcuLi9pbnRlcmZhY2VzJztcbmltcG9ydCB7IEtJTkVTQ09QRV9ERUZBVUxUX0NPTkZJRywgS2luZXNjb3BlUGxheWVyRXZlbnQsIFZJREVPX0hPU1QgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuXG5pbXBvcnQgeyBLaW5lc2NvcGVMb2FkZXJDb21wb25lbnQgfSBmcm9tICcuL2tpbmVzY29wZS1sb2FkZXIuY29tcG9uZW50JztcblxubGV0IGluZGV4ID0gMTtcblxudHlwZSBFdmVudExpc3RUeXBlcyA9IFtLaW5lc2NvcGVQbGF5ZXJFdmVudCwgKHY/OiBBY3Rpb25UeXBlKSA9PiBQcm9taXNlPHZvaWQ+IHwgdm9pZF1bXTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAna2luZXNjb3BlLXBsYXllcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGtpbmVzY29wZS1sb2FkZXIgKG9uSlNMb2FkKT1cImhhbmRsZUpTTG9hZCgpXCIgKG9uSlNMb2FkRXJyb3IpPVwiX2NvbmZpZy5vbkpTTG9hZEVycm9yPy4oKVwiPlxuICAgICAgPHNwYW4gI3BhcmVudHNSZWYgW25nQ2xhc3NdPVwiX2NvbmZpZy5jbGFzc05hbWVcIiBbbmdTdHlsZV09XCJfY29uZmlnLnN0eWxlXCI+PC9zcGFuPlxuICAgIDwva2luZXNjb3BlLWxvYWRlcj5cbiAgYCxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0tpbmVzY29wZUxvYWRlckNvbXBvbmVudCwgQ29tbW9uTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgS2luZXNjb3BlUGxheWVyQ29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgQElucHV0KCkgc2V0IGNvbmZpZyhjb25maWc6IEtpbmVzY29wZVBsYXllckNvbmZpZykge1xuICAgIGlmICh0aGlzLl9jb25maWcpIHtcbiAgICAgIGNvbnN0IHByZXZpb3VzID0gY2xvbmUodGhpcy5fY29uZmlnKTtcbiAgICAgIHRoaXMuX2NvbmZpZyA9IE9iamVjdC5hc3NpZ24oeyAuLi5LSU5FU0NPUEVfREVGQVVMVF9DT05GSUcgfSwgY29uZmlnKTtcbiAgICAgIHRoaXMuc2hvdWxkUGxheWVyVXBkYXRlKHByZXZpb3VzKTtcbiAgICAgIHRoaXMuc2hvdWxkUGxheWxpc3RVcGRhdGUocHJldmlvdXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb25maWcgPSBPYmplY3QuYXNzaWduKHsgLi4uS0lORVNDT1BFX0RFRkFVTFRfQ09ORklHIH0sIGNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgX2NvbmZpZzogS2luZXNjb3BlUGxheWVyQ29uZmlnO1xuXG4gIHByaXZhdGUgZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuICBwcml2YXRlIHJlbmRlcmVyMiA9IGluamVjdChSZW5kZXJlcjIpO1xuICBwcml2YXRlIHBsYXllckxvYWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBwbGF5ZXI6IEtpbmVzY29wZVBsYXllcjtcbiAgcHJpdmF0ZSBnZXROZXh0UGxheWVySWQgPSAoKTogc3RyaW5nID0+IGBfX2tpbmVzY29wZV9wbGF5ZXJfJHt0aGlzLmdldE5leHRJbmRleCgpfWA7XG4gIHByaXZhdGUgZ2V0TmV4dEluZGV4ID0gKCk6IG51bWJlciA9PiBpbmRleCsrO1xuXG4gIEBWaWV3Q2hpbGQoJ3BhcmVudHNSZWYnLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSkgcGFyZW50c1JlZjogRWxlbWVudFJlZjx1bmtub3duPjtcblxuICBpc1BhdXNlZCA9ICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHRoaXMucGxheWVyPy5pc1BhdXNlZCgpIHx8IFByb21pc2UucmVqZWN0KG51bGwpO1xuICBpc0VuZGVkID0gKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4gdGhpcy5wbGF5ZXI/LmlzRW5kZWQoKSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgcGxheSA9ICgpOiBQcm9taXNlPHZvaWQ+ID0+IHRoaXMucGxheWVyPy5wbGF5KCkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIHBhdXNlID0gKCk6IFByb21pc2U8Ym9vbGVhbj4gPT4gdGhpcy5wbGF5ZXI/LnBhdXNlKCkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIHN0b3AgPSAoKTogUHJvbWlzZTx2b2lkPiA9PiB0aGlzLnBsYXllcj8uc3RvcCgpIHx8IFByb21pc2UucmVqZWN0KG51bGwpO1xuICBnZXRDdXJyZW50VGltZSA9ICgpOiBQcm9taXNlPG51bWJlcj4gPT4gdGhpcy5wbGF5ZXI/LmdldEN1cnJlbnRUaW1lKCkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIGdldER1cmF0aW9uID0gKCk6IFByb21pc2U8bnVtYmVyPiA9PiB0aGlzLnBsYXllcj8uZ2V0RHVyYXRpb24oKSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgc2Vla1RvID0gKHRpbWU6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4gdGhpcy5wbGF5ZXI/LnNlZWtUbyh0aW1lKSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgaXNNdXRlZCA9ICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHRoaXMucGxheWVyPy5pc011dGVkKCkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIG11dGUgPSAoKTogUHJvbWlzZTx2b2lkPiA9PiB0aGlzLnBsYXllcj8ubXV0ZSgpIHx8IFByb21pc2UucmVqZWN0KG51bGwpO1xuICB1bm11dGUgPSAoKTogUHJvbWlzZTx2b2lkPiA9PiB0aGlzLnBsYXllcj8udW5tdXRlKCkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIGdldFZvbHVtZSA9ICgpOiBQcm9taXNlPG51bWJlcj4gPT4gdGhpcy5wbGF5ZXI/LmdldFZvbHVtZSgpIHx8IFByb21pc2UucmVqZWN0KG51bGwpO1xuICBzZXRWb2x1bWUgPSAodmFsdWU6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4gdGhpcy5wbGF5ZXI/LnNldFZvbHVtZSh2YWx1ZSkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIGdldFBsYXliYWNrUmF0ZSA9ICgpOiBQcm9taXNlPG51bWJlcj4gPT4gdGhpcy5wbGF5ZXI/LmdldFBsYXliYWNrUmF0ZSgpIHx8IFByb21pc2UucmVqZWN0KG51bGwpO1xuICBzZXRQbGF5YmFja1JhdGUgPSAodmFsdWU6IG51bWJlcik6IFByb21pc2U8dm9pZD4gPT4gdGhpcy5wbGF5ZXI/LnNldFBsYXliYWNrUmF0ZSh2YWx1ZSkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIGdldFZpZGVvUXVhbGl0eUxpc3QgPSAoKTogUHJvbWlzZTxWaWRlb1F1YWxpdHlbXT4gPT4gdGhpcy5wbGF5ZXI/LmdldFZpZGVvUXVhbGl0eUxpc3QoKSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgZ2V0Q3VycmVudFZpZGVvUXVhbGl0eSA9ICgpOiBQcm9taXNlPFZpZGVvUXVhbGl0eT4gPT4gdGhpcy5wbGF5ZXI/LmdldEN1cnJlbnRWaWRlb1F1YWxpdHkoKSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgc2V0VmlkZW9RdWFsaXR5ID0gKHF1YWxpdHk6IFZpZGVvUXVhbGl0eSk6IFByb21pc2U8dm9pZD4gPT4gdGhpcy5wbGF5ZXI/LnNldFZpZGVvUXVhbGl0eShxdWFsaXR5KSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgZW5hYmxlVGV4dFRyYWNrID0gKGxhbmc6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4gdGhpcy5wbGF5ZXI/LmVuYWJsZVRleHRUcmFjayhsYW5nKSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgZGlzYWJsZVRleHRUcmFjayA9ICgpOiBQcm9taXNlPHZvaWQ+ID0+IHRoaXMucGxheWVyPy5kaXNhYmxlVGV4dFRyYWNrKCkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIGNsb3NlQ1RBID0gKCk6IFByb21pc2U8dm9pZD4gPT4gdGhpcy5wbGF5ZXI/LmNsb3NlQ1RBKCkgfHwgUHJvbWlzZS5yZWplY3QobnVsbCk7XG4gIGlzRnVsbHNjcmVlbiA9ICgpOiBQcm9taXNlPGJvb2xlYW4+ID0+IHRoaXMucGxheWVyPy5pc0Z1bGxzY3JlZW4oKSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcbiAgc2V0RnVsbHNjcmVlbiA9IChmdWxsc2NyZWVuOiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiA9PiB0aGlzLnBsYXllcj8uc2V0RnVsbHNjcmVlbihmdWxsc2NyZWVuKSB8fCBQcm9taXNlLnJlamVjdChudWxsKTtcblxuICBhc3luYyBoYW5kbGVKU0xvYWQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKHRoaXMucGxheWVyTG9hZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBsYXllckxvYWQgPSB0cnVlO1xuICAgIHRoaXMuX2NvbmZpZy5vbkpTTG9hZD8uKCk7XG4gICAgZGVidWdnZXI7XG4gICAgYXdhaXQgdGhpcy5jcmVhdGUoKTtcbiAgfTtcblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLl9jb25maWc/Lm9uRGVzdHJveT8uKCk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHNob3VsZFBsYXllclVwZGF0ZShwcmV2UHJvcHM6IEtpbmVzY29wZVBsYXllckNvbmZpZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHZpZGVvSWQsXG4gICAgICBxdWVyeSxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgYXV0b1BhdXNlLFxuICAgICAgYXV0b1BsYXksXG4gICAgICBsb29wLFxuICAgICAgbXV0ZWQsXG4gICAgICBwbGF5c0lubGluZSxcbiAgICAgIGxhbmd1YWdlLFxuICAgICAgY29udHJvbHMsXG4gICAgICBtYWluUGxheUJ1dHRvbixcbiAgICAgIHBsYXliYWNrUmF0ZUJ1dHRvbixcbiAgICAgIHdhdGVybWFyayxcbiAgICAgIGxvY2FsU3RvcmFnZSxcbiAgICB9ID0gdGhpcy5fY29uZmlnO1xuXG4gICAgaWYgKG11dGVkICE9PSBwcmV2UHJvcHMubXV0ZWQpIHtcbiAgICAgIG11dGVkID8gYXdhaXQgdGhpcy5tdXRlKCkgOiBhd2FpdCB0aGlzLnVubXV0ZSgpO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHZpZGVvSWQgIT09IHByZXZQcm9wcy52aWRlb0lkIHx8XG4gICAgICAhaXNFcXVhbChxdWVyeSwgcHJldlByb3BzLnF1ZXJ5KSB8fFxuICAgICAgd2lkdGggIT09IHByZXZQcm9wcy53aWR0aCB8fFxuICAgICAgaGVpZ2h0ICE9PSBwcmV2UHJvcHMuaGVpZ2h0IHx8XG4gICAgICBhdXRvUGF1c2UgIT09IHByZXZQcm9wcy5hdXRvUGF1c2UgfHxcbiAgICAgIGF1dG9QbGF5ICE9PSBwcmV2UHJvcHMuYXV0b1BsYXkgfHxcbiAgICAgIGxvb3AgIT09IHByZXZQcm9wcy5sb29wIHx8XG4gICAgICBwbGF5c0lubGluZSAhPT0gcHJldlByb3BzLnBsYXlzSW5saW5lIHx8XG4gICAgICBsYW5ndWFnZSAhPT0gcHJldlByb3BzLmxhbmd1YWdlIHx8XG4gICAgICBjb250cm9scyAhPT0gcHJldlByb3BzLmNvbnRyb2xzIHx8XG4gICAgICBtYWluUGxheUJ1dHRvbiAhPT0gcHJldlByb3BzLm1haW5QbGF5QnV0dG9uIHx8XG4gICAgICBwbGF5YmFja1JhdGVCdXR0b24gIT09IHByZXZQcm9wcy5wbGF5YmFja1JhdGVCdXR0b24gfHxcbiAgICAgICFpc0VxdWFsKHdhdGVybWFyaywgcHJldlByb3BzLndhdGVybWFyaykgfHxcbiAgICAgICFpc0VxdWFsKGxvY2FsU3RvcmFnZSwgcHJldlByb3BzLmxvY2FsU3RvcmFnZSlcbiAgICApIHtcbiAgICAgIGF3YWl0IHRoaXMuY3JlYXRlKCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgYXN5bmMgc2hvdWxkUGxheWxpc3RVcGRhdGUocHJldlByb3BzOiBLaW5lc2NvcGVQbGF5ZXJDb25maWcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHRpdGxlLCBzdWJ0aXRsZSwgcG9zdGVyLCBjaGFwdGVycywgdnR0LCBib29rbWFya3MsIGFjdGlvbnMsIGRybUF1dGhUb2tlbiB9ID0gdGhpcy5fY29uZmlnO1xuXG4gICAgaWYgKHRpdGxlICE9PSBwcmV2UHJvcHMudGl0bGUpIHtcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlVGl0bGVPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgaWYgKHBvc3RlciAhPT0gcHJldlByb3BzLnBvc3Rlcikge1xuICAgICAgYXdhaXQgdGhpcy51cGRhdGVQb3N0ZXJPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgaWYgKHN1YnRpdGxlICE9PSBwcmV2UHJvcHMuc3VidGl0bGUpIHtcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlU3VidGl0bGVPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgaWYgKGRybUF1dGhUb2tlbiAhPT0gcHJldlByb3BzLmRybUF1dGhUb2tlbikge1xuICAgICAgYXdhaXQgdGhpcy51cGRhdGVEcm1BdXRoVG9rZW5PcHRpb25zKCk7XG4gICAgfVxuXG4gICAgaWYgKCFpc0VxdWFsKGNoYXB0ZXJzLCBwcmV2UHJvcHMuY2hhcHRlcnMpKSB7XG4gICAgICBhd2FpdCB0aGlzLnVwZGF0ZUNoYXB0ZXJzT3B0aW9ucygpO1xuICAgIH1cblxuICAgIGlmICghaXNFcXVhbCh2dHQsIHByZXZQcm9wcy52dHQpKSB7XG4gICAgICBhd2FpdCB0aGlzLnVwZGF0ZVZ0dE9wdGlvbnMoKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzRXF1YWwoYm9va21hcmtzLCBwcmV2UHJvcHMuYm9va21hcmtzKSkge1xuICAgICAgYXdhaXQgdGhpcy51cGRhdGVCb29rbWFya3NPcHRpb25zKCk7XG4gICAgfVxuXG4gICAgaWYgKCFpc0VxdWFsKGFjdGlvbnMsIHByZXZQcm9wcy5hY3Rpb25zKSkge1xuICAgICAgYXdhaXQgdGhpcy51cGRhdGVBY3Rpb25zT3B0aW9ucygpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZVRpdGxlT3B0aW9ucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNldFBsYXlsaXN0SXRlbU9wdGlvbnMoeyB0aXRsZTogdGhpcy5fY29uZmlnLnRpdGxlIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlUG9zdGVyT3B0aW9ucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnNldFBsYXlsaXN0SXRlbU9wdGlvbnMoeyBwb3N0ZXI6IHRoaXMuX2NvbmZpZy5wb3N0ZXIgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVTdWJ0aXRsZU9wdGlvbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zZXRQbGF5bGlzdEl0ZW1PcHRpb25zKHsgc3VidGl0bGU6IHRoaXMuX2NvbmZpZy5zdWJ0aXRsZSB9KTtcbiAgfTtcblxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZURybUF1dGhUb2tlbk9wdGlvbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zZXRQbGF5bGlzdEl0ZW1PcHRpb25zKHsgZHJtOiB7IGF1dGg6IHsgdG9rZW46IHRoaXMuX2NvbmZpZy5kcm1BdXRoVG9rZW4gfSB9IH0pO1xuICB9O1xuXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlQ2hhcHRlcnNPcHRpb25zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2V0UGxheWxpc3RJdGVtT3B0aW9ucyh7IGNoYXB0ZXJzOiB0aGlzLl9jb25maWcuY2hhcHRlcnMgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBhc3luYyB1cGRhdGVWdHRPcHRpb25zKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuc2V0UGxheWxpc3RJdGVtT3B0aW9ucyh7IHZ0dDogdGhpcy5fY29uZmlnLnZ0dCB9KTtcbiAgfTtcblxuICBwcml2YXRlIGFzeW5jIHVwZGF0ZUJvb2ttYXJrc09wdGlvbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zZXRQbGF5bGlzdEl0ZW1PcHRpb25zKHsgYm9va21hcmtzOiB0aGlzLl9jb25maWcuYm9va21hcmtzIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgYXN5bmMgdXBkYXRlQWN0aW9uc09wdGlvbnMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5zZXRQbGF5bGlzdEl0ZW1PcHRpb25zKHsgYWN0aW9uczogdGhpcy5fY29uZmlnLmFjdGlvbnMgfSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBhc3luYyByZWFkeVBsYXlsaXN0T3B0aW9ucygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IHRpdGxlLCBzdWJ0aXRsZSwgcG9zdGVyLCBjaGFwdGVycywgdnR0LCBib29rbWFya3MsIGFjdGlvbnMsIGRybUF1dGhUb2tlbiB9ID0gdGhpcy5fY29uZmlnO1xuICAgIGNvbnN0IG9wdGlvbnM6IFBsYXlsaXN0SXRlbU9wdGlvbnMgPSB7fTtcblxuICAgIG9wdGlvbnMudGl0bGUgPSB0aXRsZSA/PyB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucy5zdWJ0aXRsZSA9IHN1YnRpdGxlID8/IHVuZGVmaW5lZDtcbiAgICBvcHRpb25zLnBvc3RlciA9IHBvc3RlciA/PyB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucy5jaGFwdGVycyA9IGNoYXB0ZXJzID8/IHVuZGVmaW5lZDtcbiAgICBvcHRpb25zLnZ0dCA9IHZ0dCA/PyB1bmRlZmluZWQ7XG4gICAgb3B0aW9ucy5ib29rbWFya3MgPSBib29rbWFya3MgPz8gdW5kZWZpbmVkO1xuICAgIG9wdGlvbnMuYWN0aW9ucyA9IGFjdGlvbnMgPz8gdW5kZWZpbmVkO1xuICAgIG9wdGlvbnMuZHJtID0gZHJtQXV0aFRva2VuID8geyBhdXRoOiB7IHRva2VuOiBkcm1BdXRoVG9rZW4gfSB9IDogdW5kZWZpbmVkO1xuXG4gICAgYXdhaXQgdGhpcy5zZXRQbGF5bGlzdEl0ZW1PcHRpb25zKG9wdGlvbnMpO1xuICB9O1xuXG4gIHByaXZhdGUgYXN5bmMgY3JlYXRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuZGVzdHJveSgpO1xuXG4gICAgY29uc3QgcGFyZW50c1JlZiA9IHRoaXMucGFyZW50c1JlZi5uYXRpdmVFbGVtZW50O1xuICAgIGlmICghdGhpcy5wbGF5ZXJMb2FkIHx8ICFwYXJlbnRzUmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyogY3JlYXRlIHBsYXllcklkICovXG4gICAgdGhpcy5yZW5kZXJlcjIuc2V0UHJvcGVydHkocGFyZW50c1JlZiwgJ3RleHRDb250ZW50JywgJycpO1xuICAgIGNvbnN0IHBsYXllcklkID0gdGhpcy5nZXROZXh0UGxheWVySWQoKTtcbiAgICBjb25zdCBwbGF5ZXJEaXYgPSB0aGlzLnJlbmRlcmVyMi5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLnJlbmRlcmVyMi5zZXRBdHRyaWJ1dGUocGxheWVyRGl2LCAnaWQnLCBwbGF5ZXJJZCk7XG4gICAgdGhpcy5yZW5kZXJlcjIuYXBwZW5kQ2hpbGQocGFyZW50c1JlZiwgcGxheWVyRGl2KTtcbiAgICAvKiBmYXN0IHJlIGNyZWF0ZSBwbGF5ZXIgZml4ICovXG4gICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDApKTtcbiAgICBpZiAoIXRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocGxheWVySWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5wbGF5ZXIgPSBhd2FpdCB0aGlzLmNyZWF0ZVBsYXllcihwbGF5ZXJJZCk7XG4gICAgZGVidWdnZXI7XG4gICAgdGhpcy5nZXRFdmVudExpc3QoKS5mb3JFYWNoKGV2ZW50ID0+IHRoaXMucGxheWVyPy5vbihldmVudFswXSwgZXZlbnRbMV0pKTtcbiAgfTtcblxuICBwcml2YXRlIGFzeW5jIGRlc3Ryb3koKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnBsYXllcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLnBsYXllci5kZXN0cm95KCk7XG4gICAgdGhpcy5wbGF5ZXIgPSBudWxsO1xuICB9O1xuXG4gIHByaXZhdGUgZ2V0RXZlbnRMaXN0KCk6IEV2ZW50TGlzdFR5cGVzIHtcbiAgICBjb25zdCBldmVudHMgPSB0aGlzLnBsYXllcj8uRXZlbnRzO1xuICAgIGlmICghZXZlbnRzKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHJldHVybiBbXG4gICAgICBbZXZlbnRzLlJlYWR5LCAoZXZlbnQ6IEFjdGlvblR5cGUpID0+IHRoaXMuaGFuZGxlRXZlbnRSZWFkeShldmVudCldLFxuICAgICAgW2V2ZW50cy5EZXN0cm95LCAoKSA9PiB0aGlzLl9jb25maWc/Lm9uRGVzdHJveT8uKCldLFxuICAgICAgW2V2ZW50cy5QbGF5LCAoKSA9PiB0aGlzLl9jb25maWc/Lm9uUGxheT8uKCldLFxuICAgICAgW2V2ZW50cy5QbGF5aW5nLCAoKSA9PiB0aGlzLl9jb25maWc/Lm9uUGxheWluZz8uKCldLFxuICAgICAgW2V2ZW50cy5XYWl0aW5nLCAoKSA9PiB0aGlzLl9jb25maWc/Lm9uV2FpdGluZz8uKCldLFxuICAgICAgW2V2ZW50cy5QYXVzZSwgKCkgPT4gdGhpcy5fY29uZmlnPy5vblBhdXNlPy4oKV0sXG4gICAgICBbZXZlbnRzLkVuZGVkLCAoKSA9PiB0aGlzLl9jb25maWc/Lm9uRW5kZWQ/LigpXSxcbiAgICAgIFtldmVudHMuUXVhbGl0eUNoYW5nZWQsIChldmVudDogQWN0aW9uVHlwZSkgPT4gdGhpcy5fY29uZmlnPy5vblF1YWxpdHlDaGFuZ2VkPy4oZXZlbnQuZGF0YSBhcyBFdmVudFF1YWxpdHlDaGFuZ2VkVHlwZXMpXSxcbiAgICAgIFtldmVudHMuQXV0b1F1YWxpdHlDaGFuZ2VkLCAoZXZlbnQ6IEFjdGlvblR5cGUpID0+IHRoaXMuX2NvbmZpZz8ub25BdXRvUXVhbGl0eUNoYW5nZWQ/LihldmVudC5kYXRhIGFzIEV2ZW50UXVhbGl0eUNoYW5nZWRUeXBlcyldLFxuICAgICAgW2V2ZW50cy5TZWVrQ2hhcHRlciwgKGV2ZW50OiBBY3Rpb25UeXBlKSA9PiB0aGlzLl9jb25maWc/Lm9uU2Vla0NoYXB0ZXI/LihldmVudC5kYXRhIGFzIEV2ZW50U2Vla0NoYXB0ZXJUeXBlcyldLFxuICAgICAgW2V2ZW50cy5TaXplQ2hhbmdlZCwgKGV2ZW50OiBBY3Rpb25UeXBlKSA9PiB0aGlzLl9jb25maWc/Lm9uU2l6ZUNoYW5nZWQ/LihldmVudC5kYXRhIGFzIEV2ZW50U2l6ZUNoYW5nZWRUeXBlcyldLFxuICAgICAgW2V2ZW50cy5UaW1lVXBkYXRlLCAoZXZlbnQ6IEFjdGlvblR5cGUpID0+IHRoaXMuX2NvbmZpZz8ub25UaW1lVXBkYXRlPy4oZXZlbnQuZGF0YSBhcyBFdmVudFRpbWVVcGRhdGVUeXBlcyldLFxuICAgICAgW2V2ZW50cy5Qcm9ncmVzcywgKGV2ZW50OiBBY3Rpb25UeXBlKSA9PiB0aGlzLl9jb25maWc/Lm9uUHJvZ3Jlc3M/LihldmVudC5kYXRhIGFzIEV2ZW50UHJvZ3Jlc3NUeXBlcyldLFxuICAgICAgW2V2ZW50cy5EdXJhdGlvbkNoYW5nZSwgKGV2ZW50OiBBY3Rpb25UeXBlKSA9PiB0aGlzLl9jb25maWc/Lm9uRHVyYXRpb25DaGFuZ2U/LihldmVudC5kYXRhIGFzIEV2ZW50RHVyYXRpb25DaGFuZ2VUeXBlcyldLFxuICAgICAgW2V2ZW50cy5Wb2x1bWVDaGFuZ2UsIChldmVudDogQWN0aW9uVHlwZSkgPT4gdGhpcy5fY29uZmlnPy5vblZvbHVtZUNoYW5nZT8uKGV2ZW50LmRhdGEgYXMgRXZlbnRWb2x1bWVDaGFuZ2VUeXBlcyldLFxuICAgICAgW2V2ZW50cy5QbGF5YmFja1JhdGVDaGFuZ2UsIChldmVudDogQWN0aW9uVHlwZSkgPT4gdGhpcy5fY29uZmlnPy5vblBsYXliYWNrUmF0ZUNoYW5nZT8uKGV2ZW50LmRhdGEgYXMgRXZlbnRQbGF5YmFja1JhdGVDaGFuZ2VUeXBlcyldLFxuICAgICAgW2V2ZW50cy5TZWVraW5nLCAoKSA9PiB0aGlzLl9jb25maWc/Lm9uU2Vla2luZz8uKCldLFxuICAgICAgW2V2ZW50cy5GdWxsc2NyZWVuQ2hhbmdlLCAoZXZlbnQ6IEFjdGlvblR5cGUpID0+IHRoaXMuX2NvbmZpZz8ub25GdWxsc2NyZWVuQ2hhbmdlPy4oZXZlbnQuZGF0YSBhcyBFdmVudEZ1bGxzY3JlZW5DaGFuZ2VUeXBlcyldLFxuICAgICAgW2V2ZW50cy5DYWxsQWN0aW9uLCAoZXZlbnQ6IEFjdGlvblR5cGUpID0+IHRoaXMuX2NvbmZpZz8ub25DYWxsQWN0aW9uPy4oZXZlbnQuZGF0YSBhcyBFdmVudENhbGxBY3Rpb25UeXBlcyldLFxuICAgICAgW2V2ZW50cy5DYWxsQm9va21hcmssIChldmVudDogQWN0aW9uVHlwZSkgPT4gdGhpcy5fY29uZmlnPy5vbkNhbGxCb29rbWFyaz8uKGV2ZW50LmRhdGEgYXMgRXZlbnRDYWxsQm9va21hcmtUeXBlcyldLFxuICAgICAgW2V2ZW50cy5FcnJvciwgKGV2ZW50OiBBY3Rpb25UeXBlKSA9PiB0aGlzLl9jb25maWc/Lm9uRXJyb3I/LihldmVudC5kYXRhIGFzIEV2ZW50RXJyb3JUeXBlcyldLFxuICAgIF07XG4gIH07XG5cbiAgcHJpdmF0ZSBnZXRRdWVyeVBhcmFtcygpOiBbc3RyaW5nLCBzdHJpbmddW10ge1xuICAgIGNvbnN0IHBhcmFtczogW3N0cmluZywgc3RyaW5nXVtdID0gW107XG4gICAgaWYgKHRoaXMuX2NvbmZpZy5xdWVyeT8uZHVyYXRpb24pIHtcbiAgICAgIHBhcmFtcy5wdXNoKFsnZHVyYXRpb24nLCB0aGlzLl9jb25maWcucXVlcnkuZHVyYXRpb24udG9TdHJpbmcoKV0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY29uZmlnLnF1ZXJ5Py5zZWVrKSB7XG4gICAgICBwYXJhbXMucHVzaChbJ3NlZWsnLCB0aGlzLl9jb25maWcucXVlcnkuc2Vlay50b1N0cmluZygpXSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXM7XG4gIH07XG5cbiAgcHJpdmF0ZSBtYWtlVVJMKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBfdXJsID0gbmV3IFVSTCh1cmwpO1xuICAgIHRoaXMuZ2V0UXVlcnlQYXJhbXMoKS5mb3JFYWNoKGZ1bmN0aW9uIChwYXJhbXMpIHtcbiAgICAgIF91cmwuc2VhcmNoUGFyYW1zLmFwcGVuZChwYXJhbXNbMF0sIHBhcmFtc1sxXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIF91cmwudG9TdHJpbmcoKTtcbiAgfTtcblxuICBwcml2YXRlIGdldElGcmFtZVVybCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLm1ha2VVUkwoVklERU9fSE9TVCArIHRoaXMuX2NvbmZpZy52aWRlb0lkKTtcbiAgfTtcblxuICBwcml2YXRlIGNyZWF0ZVBsYXllcihwbGF5ZXJJZDogc3RyaW5nKTogUHJvbWlzZTxLaW5lc2NvcGVQbGF5ZXI+IHtcbiAgICBjb25zdCB7XG4gICAgICB0aXRsZSxcbiAgICAgIHN1YnRpdGxlLFxuICAgICAgcG9zdGVyLFxuICAgICAgY2hhcHRlcnMsXG4gICAgICB2dHQsXG4gICAgICBleHRlcm5hbElkLFxuICAgICAgZHJtQXV0aFRva2VuLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBhdXRvUGF1c2UsXG4gICAgICBhdXRvUGxheSxcbiAgICAgIGxvb3AsXG4gICAgICBtdXRlZCxcbiAgICAgIHBsYXlzSW5saW5lLFxuICAgICAgbGFuZ3VhZ2UsXG4gICAgICBjb250cm9scyxcbiAgICAgIG1haW5QbGF5QnV0dG9uLFxuICAgICAgcGxheWJhY2tSYXRlQnV0dG9uLFxuICAgICAgYm9va21hcmtzLFxuICAgICAgYWN0aW9ucyxcbiAgICAgIHdhdGVybWFyayxcbiAgICAgIGxvY2FsU3RvcmFnZSxcbiAgICB9ID0gdGhpcy5fY29uZmlnO1xuXG4gICAgY29uc3Qgb3B0aW9uczogS2luZXNjb3BlQ3JlYXRlT3B0aW9ucyA9IHtcbiAgICAgIHVybDogdGhpcy5nZXRJRnJhbWVVcmwoKSxcbiAgICAgIHNpemU6IHsgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodCB9LFxuICAgICAgYmVoYXZpb3VyOiB7XG4gICAgICAgIGF1dG9QYXVzZTogYXV0b1BhdXNlLFxuICAgICAgICBhdXRvUGxheTogYXV0b1BsYXksXG4gICAgICAgIGxvb3A6IGxvb3AsXG4gICAgICAgIG11dGVkOiBtdXRlZCxcbiAgICAgICAgcGxheXNJbmxpbmU6IHBsYXlzSW5saW5lLFxuICAgICAgICBsb2NhbFN0b3JhZ2U6IGxvY2FsU3RvcmFnZSxcbiAgICAgIH0sXG4gICAgICBwbGF5bGlzdDogW1xuICAgICAgICB7XG4gICAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICAgIHN1YnRpdGxlOiBzdWJ0aXRsZSxcbiAgICAgICAgICBwb3N0ZXI6IHBvc3RlcixcbiAgICAgICAgICBjaGFwdGVyczogY2hhcHRlcnMsXG4gICAgICAgICAgdnR0OiB2dHQsXG4gICAgICAgICAgYm9va21hcmtzOiBib29rbWFya3MsXG4gICAgICAgICAgYWN0aW9uczogYWN0aW9ucyxcbiAgICAgICAgICBkcm06IHtcbiAgICAgICAgICAgIGF1dGg6IHtcbiAgICAgICAgICAgICAgdG9rZW46IGRybUF1dGhUb2tlbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICB1aToge1xuICAgICAgICBsYW5ndWFnZTogbGFuZ3VhZ2UsXG4gICAgICAgIGNvbnRyb2xzOiBjb250cm9scyxcbiAgICAgICAgbWFpblBsYXlCdXR0b246IG1haW5QbGF5QnV0dG9uLFxuICAgICAgICBwbGF5YmFja1JhdGVCdXR0b246IHBsYXliYWNrUmF0ZUJ1dHRvbixcbiAgICAgICAgd2F0ZXJtYXJrOiB3YXRlcm1hcmssXG4gICAgICB9LFxuICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgZXh0ZXJuYWxJZDogZXh0ZXJuYWxJZCxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHJldHVybiB3aW5kb3cuS2luZXNjb3BlLklmcmFtZVBsYXllci5jcmVhdGUocGxheWVySWQsIG9wdGlvbnMpO1xuICB9O1xuXG4gIHByaXZhdGUgYXN5bmMgc2V0UGxheWxpc3RJdGVtT3B0aW9ucyhvcHRpb25zOiBQbGF5bGlzdEl0ZW1PcHRpb25zKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgaWYgKCF0aGlzLnBsYXllcikge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbiAgICBhd2FpdCB0aGlzLnBsYXllci5zZXRQbGF5bGlzdEl0ZW1PcHRpb25zKG9wdGlvbnMpO1xuICB9O1xuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlRXZlbnRSZWFkeShldmVudDogQWN0aW9uVHlwZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMucmVhZHlQbGF5bGlzdE9wdGlvbnMoKTtcbiAgICB0aGlzLl9jb25maWc/Lm9uUmVhZHk/LihldmVudC5kYXRhIGFzIEV2ZW50UmVhZHlUeXBlcyk7XG4gIH07XG59XG4iXX0=