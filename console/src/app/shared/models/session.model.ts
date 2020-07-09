import { ModelCommon } from '../models';

export namespace SessionModel {
  export interface State {
    language: string;
    tenant: ModelCommon.BasicItem;
    sessionDetail: SessionDetail;
  }

  export interface SessionDetail {
    openedTabCount: number;
    lastExitTime: number;
    remember: boolean;
  }
}
