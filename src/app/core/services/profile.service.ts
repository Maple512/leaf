import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProfileModel, RestModel } from '../models';
import { AppConfigState } from '../states/config.state';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  apiName = '';

  constructor(private rest: RestService, private store: Store) { }

  get(): Observable<ProfileModel.Response> {
    const getProfileApi = this.store.selectSnapshot(AppConfigState.getApi('getProfile'));

    const request: RestModel.Request<null> = {
      method: 'GET',
      url: getProfileApi,
    };

    return this.rest.request<null, ProfileModel.Response>(request, { apiName: this.apiName });
  }

  update(body: ProfileModel.Response): Observable<ProfileModel.Response> {
    const putProfileApi = this.store.selectSnapshot(AppConfigState.getApi('putProfile'));

    const request: RestModel.Request<ProfileModel.Response> = {
      method: 'PUT',
      url: putProfileApi,
      body,
    };

    return this.rest.request<ProfileModel.Response, ProfileModel.Response>(request, {
      apiName: this.apiName,
    });
  }

  changePassword(
    body: ProfileModel.ChangePasswordRequest,
    skipHandleError: boolean = false,
  ): Observable<null> {
    const changePwdApi = this.store.selectSnapshot(AppConfigState.getApi('changePwd'));

    const request: RestModel.Request<ProfileModel.ChangePasswordRequest> = {
      method: 'POST',
      url: changePwdApi,
      body,
    };

    return this.rest.request<ProfileModel.ChangePasswordRequest, null>(request, {
      skipHandleError,
      apiName: this.apiName,
    });
  }
}
