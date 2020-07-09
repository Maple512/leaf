import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { GetAppConfiguration, SetEnvironment } from '../actions';
import { AppConfigState } from '../states';

@Injectable({
  providedIn: 'root',
})
export class ConfigStateService {
  constructor(private store: Store) { }

  getAll() {
    return this.store.selectSnapshot(AppConfigState.getAll);
  }

  getApplicationInfo() {
    return this.store.selectSnapshot(AppConfigState.getAppInfo);
  }

  getOne(...args: Parameters<typeof AppConfigState.getOne>) {
    return this.store.selectSnapshot(AppConfigState.getOne(...args));
  }

  getDeep(...args: Parameters<typeof AppConfigState.getDeep>) {
    return this.store.selectSnapshot(AppConfigState.getDeep(...args));
  }

  getApiUrl(...args: Parameters<typeof AppConfigState.getApiUrl>) {
    return this.store.selectSnapshot(AppConfigState.getApiUrl(...args));
  }

  getSetting(...args: Parameters<typeof AppConfigState.getSetting>) {
    return this.store.selectSnapshot(AppConfigState.getSetting(...args));
  }

  getSettings(...args: Parameters<typeof AppConfigState.getSettings>) {
    return this.store.selectSnapshot(AppConfigState.getSettings(...args));
  }

  getGrantedPolicy(...args: Parameters<typeof AppConfigState.getGrantedPolicy>) {
    return this.store.selectSnapshot(AppConfigState.getGrantedPolicy(...args));
  }

  getLocalization(...args: Parameters<typeof AppConfigState.getLocalization>) {
    return this.store.selectSnapshot(AppConfigState.getLocalization(...args));
  }

  dispatchGetAppConfiguration() {
    return this.store.dispatch(new GetAppConfiguration());
  }

  dispatchSetEnvironment(...args: ConstructorParameters<typeof SetEnvironment>) {
    return this.store.dispatch(new SetEnvironment(...args));
  }
}
