import { Type } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { ModelCommon } from '../models';
import { AppConfigResponse } from '../responses';

export namespace AppConfig {

  export type State = AppConfigResponse.Response & ModelCommon.RootOptions & { environment: Environment; };

  export interface Environment {
    application: AppInfo;
    production: boolean;
    hmr?: boolean;
    oAuthConfig: AuthConfig;
    apis: Apis;
    localization?: { defaultResourceName?: string; };
  }

  export interface AppInfo {
    name: string;
    logoUrl?: string;
    description?: string;
  }

  export interface ApiConfig {
    url: string;
    [key: string]: string;
  }

  export interface Apis {
    default: ApiConfig;
    [key: string]: ApiConfig;
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
