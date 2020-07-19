import { Type } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { ModelCommon } from '../models';
import { AppConfigResponse } from '../responses';

export namespace AppConfig {

  export type State = AppConfigResponse.Response & ModelCommon.RootOptions & { environment: Environment; };

  export interface Environment {
    application: AppInfo;
    production: boolean;
    useHash?: boolean;
    hmr?: boolean;
    oAuthConfig: AuthConfig;
    apis: Apis;
    localization?: { defaultResourceName?: string; };
    urls: Urls;
  }

  export interface Urls {
    login: string;
    [key: string]: string;
  }

  export interface AppInfo {
    name: string;
    logoUrl?: string;
    description?: string;
  }

  export interface Apis {
    control: string;
    /**
     * default: `/api/abp/application-configuration`
     */
    abpConfig: string;
    logout: string;
    getProfile: string;
    putProfile: string;
    changePwd: string;
    [key: string]: string;
  }

  export interface Requirements {
    layouts: Type<any>[];
  }

  export interface LocalizationWithDefault {
    key: string;
    defaultValue: string;
  }

  export type LocalizationParam = string | LocalizationWithDefault;
}
