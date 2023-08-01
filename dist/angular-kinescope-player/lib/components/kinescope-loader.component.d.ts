import { EventEmitter, OnInit } from '@angular/core';
import { KinescopeCreateOptions, KinescopePlayer } from '../interfaces';
import * as i0 from "@angular/core";
declare global {
    interface Window {
        Kinescope: {
            IframePlayer: {
                create: (id: string, options: KinescopeCreateOptions) => Promise<KinescopePlayer>;
                version: string;
            };
        };
    }
}
export declare class KinescopeLoaderComponent implements OnInit {
    onJSLoad: EventEmitter<void>;
    onJSLoadError: EventEmitter<ErrorEvent>;
    private document;
    private testLoadJS;
    ngOnInit(): void;
    private loadJsNotLoad;
    private loadJs;
    private loadScript;
    static ɵfac: i0.ɵɵFactoryDeclaration<KinescopeLoaderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<KinescopeLoaderComponent, "kinescope-loader", never, {}, { "onJSLoad": "onJSLoad"; "onJSLoadError": "onJSLoadError"; }, never, ["*"], true>;
}
