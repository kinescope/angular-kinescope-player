import * as i0 from '@angular/core';
import { EventEmitter, inject, Component, Output, Renderer2, ElementRef, Input, ViewChild } from '@angular/core';
import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import { clone, isEqual } from 'lodash';

const PLAYER_LATEST = 'https://player.kinescope.io/latest/iframe.player.js';

const VIDEO_HOST = 'https://kinescope.io/embed/';

var KinescopePlayerEvent;
(function (KinescopePlayerEvent) {
    KinescopePlayerEvent[KinescopePlayerEvent["Ready"] = 0] = "Ready";
    KinescopePlayerEvent[KinescopePlayerEvent["QualityChanged"] = 1] = "QualityChanged";
    KinescopePlayerEvent[KinescopePlayerEvent["AutoQualityChanged"] = 2] = "AutoQualityChanged";
    KinescopePlayerEvent[KinescopePlayerEvent["SeekChapter"] = 3] = "SeekChapter";
    KinescopePlayerEvent[KinescopePlayerEvent["SizeChanged"] = 4] = "SizeChanged";
    KinescopePlayerEvent[KinescopePlayerEvent["Play"] = 5] = "Play";
    KinescopePlayerEvent[KinescopePlayerEvent["Playing"] = 6] = "Playing";
    KinescopePlayerEvent[KinescopePlayerEvent["Waiting"] = 7] = "Waiting";
    KinescopePlayerEvent[KinescopePlayerEvent["Pause"] = 8] = "Pause";
    KinescopePlayerEvent[KinescopePlayerEvent["Ended"] = 9] = "Ended";
    KinescopePlayerEvent[KinescopePlayerEvent["TimeUpdate"] = 10] = "TimeUpdate";
    KinescopePlayerEvent[KinescopePlayerEvent["Progress"] = 11] = "Progress";
    KinescopePlayerEvent[KinescopePlayerEvent["DurationChange"] = 12] = "DurationChange";
    KinescopePlayerEvent[KinescopePlayerEvent["VolumeChange"] = 13] = "VolumeChange";
    KinescopePlayerEvent[KinescopePlayerEvent["PlaybackRateChange"] = 14] = "PlaybackRateChange";
    KinescopePlayerEvent[KinescopePlayerEvent["Seeking"] = 15] = "Seeking";
    KinescopePlayerEvent[KinescopePlayerEvent["FullscreenChange"] = 16] = "FullscreenChange";
    KinescopePlayerEvent[KinescopePlayerEvent["CallAction"] = 17] = "CallAction";
    KinescopePlayerEvent[KinescopePlayerEvent["CallBookmark"] = 18] = "CallBookmark";
    KinescopePlayerEvent[KinescopePlayerEvent["Error"] = 19] = "Error";
    KinescopePlayerEvent[KinescopePlayerEvent["Destroy"] = 20] = "Destroy";
})(KinescopePlayerEvent || (KinescopePlayerEvent = {}));

const NODE_JS_ID = '__kinescope_player_angular';

const KINESCOPE_DEFAULT_CONFIG = {
    width: '100%',
    height: '100%',
    autoPause: true,
    localStorage: true,
    playsInline: true,
};

class KinescopeLoaderComponent {
    constructor() {
        this.onJSLoad = new EventEmitter();
        this.onJSLoadError = new EventEmitter();
        this.document = inject(DOCUMENT);
        this.testLoadJS = () => !!this.document.getElementById(NODE_JS_ID);
    }
    ngOnInit() {
        if (this.document.defaultView?.Kinescope?.IframePlayer) {
            this.onJSLoad.emit();
            return;
        }
        if (this.testLoadJS()) {
            this.loadJsNotLoad();
            return;
        }
        this.loadScript(PLAYER_LATEST, NODE_JS_ID)
            .then(success => success && this.onJSLoad.emit())
            .catch(e => this.onJSLoadError.emit(e));
    }
    loadJsNotLoad() {
        const el = this.document.getElementById(NODE_JS_ID);
        if (el) {
            el.addEventListener('load', () => this.loadJs());
        }
    }
    ;
    loadJs() {
        const el = this.document.getElementById(NODE_JS_ID);
        if (el) {
            el.removeEventListener('load', () => this.loadJs());
        }
        this.onJSLoad.emit();
    }
    ;
    loadScript(src, id) {
        return new Promise((resolve, reject) => {
            const script = this.document.createElement('script');
            script.id = id;
            script.src = src;
            script.addEventListener('load', () => resolve(true));
            script.addEventListener('error', e => reject(e));
            this.document.body.appendChild(script);
        });
    }
}
KinescopeLoaderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: KinescopeLoaderComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
KinescopeLoaderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.3.0", type: KinescopeLoaderComponent, isStandalone: true, selector: "kinescope-loader", outputs: { onJSLoad: "onJSLoad", onJSLoadError: "onJSLoadError" }, ngImport: i0, template: '<ng-content></ng-content>', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.3.0", ngImport: i0, type: KinescopeLoaderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'kinescope-loader',
                    template: '<ng-content></ng-content>',
                    standalone: true,
                }]
        }], propDecorators: { onJSLoad: [{
                type: Output
            }], onJSLoadError: [{
                type: Output
            }] } });

let index = 1;
class KinescopePlayerComponent {
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

/**
 * Generated bundle index. Do not edit.
 */

export { KINESCOPE_DEFAULT_CONFIG, KinescopeLoaderComponent, KinescopePlayerComponent, KinescopePlayerEvent, NODE_JS_ID, PLAYER_LATEST, VIDEO_HOST };
//# sourceMappingURL=angular-kinescope-player.mjs.map
