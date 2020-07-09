import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestService } from './rest.service';
import { ProfileModel, RestModel } from '../models';

// TODO: 这里需要配置一下
@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  apiName = '';

  constructor(private rest: RestService) { }

  get(): Observable<ProfileModel.Response> {
    const request: RestModel.Request<null> = {
      method: 'GET',
      url: '/api/identity/my-profile',
    };

    return this.rest.request<null, ProfileModel.Response>(request, { apiName: this.apiName });
  }

  update(body: ProfileModel.Response): Observable<ProfileModel.Response> {
    const request: RestModel.Request<ProfileModel.Response> = {
      method: 'PUT',
      url: '/api/identity/my-profile',
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
    const request: RestModel.Request<ProfileModel.ChangePasswordRequest> = {
      method: 'POST',
      url: '/api/identity/my-profile/change-password',
      body,
    };

    return this.rest.request<ProfileModel.ChangePasswordRequest, null>(request, {
      skipHandleError,
      apiName: this.apiName,
    });
  }
}
