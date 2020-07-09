import { AppConfig } from '../configs';

export namespace ModelCommon {

  export interface RootOptions {
    environment: Partial<AppConfig.Environment>;
    skipGetAppConfiguration?: boolean;
    sendNullsAsQueryParam?: boolean;
  }

  export type PagedResponse<T> = {
    totalCount: number;
  } & PagedItemsResponse<T>;

  export interface PagedItemsResponse<T> {
    items: T[];
  }

  export interface PageQueryParams {
    sorting?: string;
    skipCount?: number;
    maxResultCount?: number;
    [key: string]: any;
  }

  export interface Dictionary<T = any> {
    [key: string]: T;
  }

  export interface BasicItem {
    id: string;
    name: string;
  }
}
