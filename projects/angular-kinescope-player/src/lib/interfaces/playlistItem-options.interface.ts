import { ActionCallToAction } from './action-call-to-action.type';
import { ActionToolBar } from './action-tool-bar.type';

export interface PlaylistItemOptions {
  title?: string;
  subtitle?: string;
  poster?: string;
  vtt?: {
    label: string;
    src: string;
    srcLang: string;
  }[];
  chapters?: {
    position: number;
    title: string;
  }[];
  bookmarks?: {
    id: string;
    time: number;
    title?: string;
  }[];
  actions?: (ActionToolBar | ActionCallToAction)[];
  drm?: {
    auth?: {
      token?: string;
    };
  };
}
