import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RestModel } from '../models';
import { AppConfigResponse } from '../responses';
import { AppConfigState } from '../states/config.state';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  get apiName(): string {
    return this.store.selectSnapshot(AppConfigState.getDeep('environment.application.name'));
  }

  constructor(
    private rest: RestService,
    private store: Store
  ) { }

  getConfiguration(): Observable<AppConfigResponse.Response> {
    const abpConfigApi = this.store.selectSnapshot(AppConfigState.getApi('abpConfig'));

    const request: RestModel.Request<null> = {
      method: 'GET',
      url: abpConfigApi,
    };

    return this.rest.request<null, AppConfigResponse.Response>(request, {
      apiName: this.apiName,
    });
  }
}
