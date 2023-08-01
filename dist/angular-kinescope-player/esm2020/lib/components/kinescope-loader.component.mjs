import { Component, EventEmitter, inject, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NODE_JS_ID, PLAYER_LATEST } from '../constants';
import * as i0 from "@angular/core";
export class KinescopeLoaderComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2luZXNjb3BlLWxvYWRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9hbmd1bGFyLWtpbmVzY29wZS1wbGF5ZXIvc3JjL2xpYi9jb21wb25lbnRzL2tpbmVzY29wZS1sb2FkZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEYsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRzNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLE1BQU0sY0FBYyxDQUFDOztBQWtCekQsTUFBTSxPQUFPLHdCQUF3QjtJQUxyQztRQU1ZLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBQ3BDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQWMsQ0FBQztRQUVqRCxhQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVCLGVBQVUsR0FBRyxHQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7S0EwQ2hGO0lBeENDLFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUU7WUFDdEQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNyQixPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDO2FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2hELEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVPLGFBQWE7UUFDbkIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsSUFBSSxFQUFFLEVBQUU7WUFDTixFQUFFLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQztJQUFBLENBQUM7SUFFTSxNQUFNO1FBQ1osTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsSUFBSSxFQUFFLEVBQUU7WUFDTixFQUFFLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBQUEsQ0FBQztJQUVNLFVBQVUsQ0FBQyxHQUFXLEVBQUUsRUFBVTtRQUN4QyxPQUFPLElBQUksT0FBTyxDQUFVLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2YsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDakIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNyRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7cUhBOUNVLHdCQUF3Qjt5R0FBeEIsd0JBQXdCLCtJQUh6QiwyQkFBMkI7MkZBRzFCLHdCQUF3QjtrQkFMcEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsa0JBQWtCO29CQUM1QixRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxVQUFVLEVBQUUsSUFBSTtpQkFDakI7OEJBRVcsUUFBUTtzQkFBakIsTUFBTTtnQkFDRyxhQUFhO3NCQUF0QixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIGluamVjdCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHsgS2luZXNjb3BlQ3JlYXRlT3B0aW9ucywgS2luZXNjb3BlUGxheWVyIH0gZnJvbSAnLi4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBOT0RFX0pTX0lELCBQTEFZRVJfTEFURVNUIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBLaW5lc2NvcGU6IHtcbiAgICAgIElmcmFtZVBsYXllcjoge1xuICAgICAgICBjcmVhdGU6IChpZDogc3RyaW5nLCBvcHRpb25zOiBLaW5lc2NvcGVDcmVhdGVPcHRpb25zKSA9PiBQcm9taXNlPEtpbmVzY29wZVBsYXllcj47XG4gICAgICAgIHZlcnNpb246IHN0cmluZztcbiAgICAgIH07XG4gICAgfTtcbiAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdraW5lc2NvcGUtbG9hZGVyJyxcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbn0pXG5leHBvcnQgY2xhc3MgS2luZXNjb3BlTG9hZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQE91dHB1dCgpIG9uSlNMb2FkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgb25KU0xvYWRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8RXJyb3JFdmVudD4oKTtcblxuICBwcml2YXRlIGRvY3VtZW50ID0gaW5qZWN0KERPQ1VNRU5UKTtcbiAgcHJpdmF0ZSB0ZXN0TG9hZEpTID0gKCk6IGJvb2xlYW4gPT4gISF0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKE5PREVfSlNfSUQpO1xuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3Py5LaW5lc2NvcGU/LklmcmFtZVBsYXllcikge1xuICAgICAgdGhpcy5vbkpTTG9hZC5lbWl0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudGVzdExvYWRKUygpKSB7XG4gICAgICB0aGlzLmxvYWRKc05vdExvYWQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5sb2FkU2NyaXB0KFBMQVlFUl9MQVRFU1QsIE5PREVfSlNfSUQpXG4gICAgICAudGhlbihzdWNjZXNzID0+IHN1Y2Nlc3MgJiYgdGhpcy5vbkpTTG9hZC5lbWl0KCkpXG4gICAgICAuY2F0Y2goZSA9PiB0aGlzLm9uSlNMb2FkRXJyb3IuZW1pdChlKSk7XG4gIH1cblxuICBwcml2YXRlIGxvYWRKc05vdExvYWQoKTogdm9pZCB7XG4gICAgY29uc3QgZWwgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKE5PREVfSlNfSUQpO1xuICAgIGlmIChlbCkge1xuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHRoaXMubG9hZEpzKCkpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGxvYWRKcygpOiB2b2lkIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoTk9ERV9KU19JRCk7XG4gICAgaWYgKGVsKSB7XG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gdGhpcy5sb2FkSnMoKSk7XG4gICAgfVxuICAgIHRoaXMub25KU0xvYWQuZW1pdCgpO1xuICB9O1xuXG4gIHByaXZhdGUgbG9hZFNjcmlwdChzcmM6IHN0cmluZywgaWQ6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbiB8IEVycm9yRXZlbnQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8Ym9vbGVhbj4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIHNjcmlwdC5pZCA9IGlkO1xuICAgICAgc2NyaXB0LnNyYyA9IHNyYztcbiAgICAgIHNjcmlwdC5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4gcmVzb2x2ZSh0cnVlKSk7XG4gICAgICBzY3JpcHQuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlID0+IHJlamVjdChlKSk7XG4gICAgICB0aGlzLmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9KTtcbiAgfVxufVxuIl19