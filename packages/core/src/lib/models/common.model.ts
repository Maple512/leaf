import { AppConfig } from '../configs';
import { Router } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

export namespace ModelCommon {

  export interface RootOptions {
    environment: Partial<AppConfig.Environment>;
    skipGetAppConfiguration?: boolean;
    sendNullsAsQueryParam?: boolean;
  }

  export interface TestOptions {
    baseHref?: Router;
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

  export interface Option<T> {
    key: Extract<keyof T, string>;
    value: T[Extract<keyof T, string>];
  }

  export interface BasicItem {
    id: string;
    name: string;
  }

  export type ExtractFromOutput<
    T extends EventEmitter<any> | Subject<any>
    > = T extends EventEmitter<infer X> ? X : T extends Subject<infer Y> ? Y : never;
}
