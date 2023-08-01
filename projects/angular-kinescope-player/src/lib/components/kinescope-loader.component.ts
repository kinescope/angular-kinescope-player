import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { KinescopeCreateOptions, KinescopePlayer } from '../interfaces';
import { NODE_JS_ID, PLAYER_LATEST } from '../constants';

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

@Component({
  selector: 'kinescope-loader',
  template: '<ng-content></ng-content>',
  standalone: true,
})
export class KinescopeLoaderComponent implements OnInit {
  @Output() onJSLoad = new EventEmitter<void>();
  @Output() onJSLoadError = new EventEmitter<ErrorEvent>();

  private document = inject(DOCUMENT);
  private testLoadJS = (): boolean => !!this.document.getElementById(NODE_JS_ID);

  ngOnInit(): void {
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

  private loadJsNotLoad(): void {
    const el = this.document.getElementById(NODE_JS_ID);
    if (el) {
      el.addEventListener('load', () => this.loadJs());
    }
  };

  private loadJs(): void {
    const el = this.document.getElementById(NODE_JS_ID);
    if (el) {
      el.removeEventListener('load', () => this.loadJs());
    }
    this.onJSLoad.emit();
  };

  private loadScript(src: string, id: string): Promise<boolean | ErrorEvent> {
    return new Promise<boolean>((resolve, reject) => {
      const script = this.document.createElement('script');
      script.id = id;
      script.src = src;
      script.addEventListener('load', () => resolve(true));
      script.addEventListener('error', e => reject(e));
      this.document.body.appendChild(script);
    });
  }
}
