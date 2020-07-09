import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RestModel } from '../models';
import { AppConfigResponse } from '../responses';
import { AppConfigState } from '../states';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  get apiName(): string {
    return this.store.selectSnapshot(AppConfigState.getDeep('environment.application.name'));
  }

  constructor(private rest: RestService, private store: Store) { }

  // TODO: 这里需要Config
  getConfiguration(): Observable<AppConfigResponse.Response> {
    const request: RestModel.Request<null> = {
      method: 'GET',
      url: '/api/abp/application-configuration',
    };

    return this.rest.request<null, AppConfigResponse.Response>(request, {
      apiName: this.apiName,
    });
  }
}
