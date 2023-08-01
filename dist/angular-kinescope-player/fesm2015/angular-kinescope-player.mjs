import * as i0 from '@angular/core';
import { EventEmitter, inject, Component, Output, Renderer2, ElementRef, Input, ViewChild } from '@angular/core';
import * as i1 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import { __awaiter } from 'tslib';
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
        var _a, _b;
        if ((_b = (_a = this.document.defaultView) === null || _a === void 0 ? void 0 : _a.Kinescope) === null || _b === void 0 ? void 0 : _b.IframePlayer) {
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
        this.isPaused = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.isPaused()) || Promise.reject(null); };
        this.isEnded = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.isEnded()) || Promise.reject(null); };
        this.play = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.play()) || Promise.reject(null); };
        this.pause = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.pause()) || Promise.reject(null); };
        this.stop = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.stop()) || Promise.reject(null); };
        this.getCurrentTime = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.getCurrentTime()) || Promise.reject(null); };
        this.getDuration = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.getDuration()) || Promise.reject(null); };
        this.seekTo = (time) => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.seekTo(time)) || Promise.reject(null); };
        this.isMuted = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.isMuted()) || Promise.reject(null); };
        this.mute = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.mute()) || Promise.reject(null); };
        this.unmute = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.unmute()) || Promise.reject(null); };
        this.getVolume = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.getVolume()) || Promise.reject(null); };
        this.setVolume = (value) => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.setVolume(value)) || Promise.reject(null); };
        this.getPlaybackRate = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.getPlaybackRate()) || Promise.reject(null); };
        this.setPlaybackRate = (value) => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.setPlaybackRate(value)) || Promise.reject(null); };
        this.getVideoQualityList = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.getVideoQualityList()) || Promise.reject(null); };
        this.getCurrentVideoQuality = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.getCurrentVideoQuality()) || Promise.reject(null); };
        this.setVideoQuality = (quality) => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.setVideoQuality(quality)) || Promise.reject(null); };
        this.enableTextTrack = (lang) => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.enableTextTrack(lang)) || Promise.reject(null); };
        this.disableTextTrack = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.disableTextTrack()) || Promise.reject(null); };
        this.closeCTA = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.closeCTA()) || Promise.reject(null); };
        this.isFullscreen = () => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.isFullscreen()) || Promise.reject(null); };
        this.setFullscreen = (fullscreen) => { var _a; return ((_a = this.player) === null || _a === void 0 ? void 0 : _a.setFullscreen(fullscreen)) || Promise.reject(null); };
    }
    set config(config) {
        if (this._config) {
            const previous = clone(this._config);
            this._config = Object.assign(Object.assign({}, KINESCOPE_DEFAULT_CONFIG), config);
            this.shouldPlayerUpdate(previous);
            this.shouldPlaylistUpdate(previous);
        }
        else {
            this._config = Object.assign(Object.assign({}, KINESCOPE_DEFAULT_CONFIG), config);
        }
    }
    handleJSLoad() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.playerLoad) {
                return;
            }
            this.playerLoad = true;
            (_b = (_a = this._config).onJSLoad) === null || _b === void 0 ? void 0 : _b.call(_a);
            debugger;
            yield this.create();
        });
    }
    ;
    ngOnDestroy() {
        var _a, _b;
        (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onDestroy) === null || _b === void 0 ? void 0 : _b.call(_a);
    }
    shouldPlayerUpdate(prevProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { videoId, query, width, height, autoPause, autoPlay, loop, muted, playsInline, language, controls, mainPlayButton, playbackRateButton, watermark, localStorage, } = this._config;
            if (muted !== prevProps.muted) {
                muted ? yield this.mute() : yield this.unmute();
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
                yield this.create();
            }
        });
    }
    ;
    shouldPlaylistUpdate(prevProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, subtitle, poster, chapters, vtt, bookmarks, actions, drmAuthToken } = this._config;
            if (title !== prevProps.title) {
                yield this.updateTitleOptions();
            }
            if (poster !== prevProps.poster) {
                yield this.updatePosterOptions();
            }
            if (subtitle !== prevProps.subtitle) {
                yield this.updateSubtitleOptions();
            }
            if (drmAuthToken !== prevProps.drmAuthToken) {
                yield this.updateDrmAuthTokenOptions();
            }
            if (!isEqual(chapters, prevProps.chapters)) {
                yield this.updateChaptersOptions();
            }
            if (!isEqual(vtt, prevProps.vtt)) {
                yield this.updateVttOptions();
            }
            if (!isEqual(bookmarks, prevProps.bookmarks)) {
                yield this.updateBookmarksOptions();
            }
            if (!isEqual(actions, prevProps.actions)) {
                yield this.updateActionsOptions();
            }
        });
    }
    ;
    updateTitleOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPlaylistItemOptions({ title: this._config.title });
        });
    }
    ;
    updatePosterOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPlaylistItemOptions({ poster: this._config.poster });
        });
    }
    ;
    updateSubtitleOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPlaylistItemOptions({ subtitle: this._config.subtitle });
        });
    }
    ;
    updateDrmAuthTokenOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPlaylistItemOptions({ drm: { auth: { token: this._config.drmAuthToken } } });
        });
    }
    ;
    updateChaptersOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPlaylistItemOptions({ chapters: this._config.chapters });
        });
    }
    ;
    updateVttOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPlaylistItemOptions({ vtt: this._config.vtt });
        });
    }
    ;
    updateBookmarksOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPlaylistItemOptions({ bookmarks: this._config.bookmarks });
        });
    }
    ;
    updateActionsOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setPlaylistItemOptions({ actions: this._config.actions });
        });
    }
    ;
    readyPlaylistOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, subtitle, poster, chapters, vtt, bookmarks, actions, drmAuthToken } = this._config;
            const options = {};
            options.title = title !== null && title !== void 0 ? title : undefined;
            options.subtitle = subtitle !== null && subtitle !== void 0 ? subtitle : undefined;
            options.poster = poster !== null && poster !== void 0 ? poster : undefined;
            options.chapters = chapters !== null && chapters !== void 0 ? chapters : undefined;
            options.vtt = vtt !== null && vtt !== void 0 ? vtt : undefined;
            options.bookmarks = bookmarks !== null && bookmarks !== void 0 ? bookmarks : undefined;
            options.actions = actions !== null && actions !== void 0 ? actions : undefined;
            options.drm = drmAuthToken ? { auth: { token: drmAuthToken } } : undefined;
            yield this.setPlaylistItemOptions(options);
        });
    }
    ;
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.destroy();
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
            yield new Promise(resolve => setTimeout(resolve, 0));
            if (!this.document.getElementById(playerId)) {
                return;
            }
            this.player = yield this.createPlayer(playerId);
            debugger;
            this.getEventList().forEach(event => { var _a; return (_a = this.player) === null || _a === void 0 ? void 0 : _a.on(event[0], event[1]); });
        });
    }
    ;
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.player) {
                return;
            }
            yield this.player.destroy();
            this.player = null;
        });
    }
    ;
    getEventList() {
        var _a;
        const events = (_a = this.player) === null || _a === void 0 ? void 0 : _a.Events;
        if (!events) {
            return [];
        }
        return [
            [events.Ready, (event) => this.handleEventReady(event)],
            [events.Destroy, () => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onDestroy) === null || _b === void 0 ? void 0 : _b.call(_a); }],
            [events.Play, () => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onPlay) === null || _b === void 0 ? void 0 : _b.call(_a); }],
            [events.Playing, () => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onPlaying) === null || _b === void 0 ? void 0 : _b.call(_a); }],
            [events.Waiting, () => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onWaiting) === null || _b === void 0 ? void 0 : _b.call(_a); }],
            [events.Pause, () => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onPause) === null || _b === void 0 ? void 0 : _b.call(_a); }],
            [events.Ended, () => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onEnded) === null || _b === void 0 ? void 0 : _b.call(_a); }],
            [events.QualityChanged, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onQualityChanged) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.AutoQualityChanged, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onAutoQualityChanged) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.SeekChapter, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onSeekChapter) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.SizeChanged, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onSizeChanged) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.TimeUpdate, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onTimeUpdate) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.Progress, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onProgress) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.DurationChange, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onDurationChange) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.VolumeChange, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onVolumeChange) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.PlaybackRateChange, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onPlaybackRateChange) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.Seeking, () => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onSeeking) === null || _b === void 0 ? void 0 : _b.call(_a); }],
            [events.FullscreenChange, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onFullscreenChange) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.CallAction, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onCallAction) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.CallBookmark, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onCallBookmark) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
            [events.Error, (event) => { var _a, _b; return (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onError) === null || _b === void 0 ? void 0 : _b.call(_a, event.data); }],
        ];
    }
    ;
    getQueryParams() {
        var _a, _b;
        const params = [];
        if ((_a = this._config.query) === null || _a === void 0 ? void 0 : _a.duration) {
            params.push(['duration', this._config.query.duration.toString()]);
        }
        if ((_b = this._config.query) === null || _b === void 0 ? void 0 : _b.seek) {
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
    setPlaylistItemOptions(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.player) {
                return Promise.resolve();
            }
            yield this.player.setPlaylistItemOptions(options);
        });
    }
    ;
    handleEventReady(event) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.readyPlaylistOptions();
            (_b = (_a = this._config) === null || _a === void 0 ? void 0 : _a.onReady) === null || _b === void 0 ? void 0 : _b.call(_a, event.data);
        });
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
