import { HttpClient, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RestOccurError } from '../actions/rest.actions';
import { ModelCommon, RestModel } from '../models';
import { AppConfigState } from '../states/config.state';
import { CORE_OPTIONS } from '../tokens/options.token';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  constructor(
    @Inject(CORE_OPTIONS) private options: ModelCommon.RootOptions,
    private http: HttpClient,
    private store: Store,
  ) { }

  private getApiFromStore(apiName: string): string {
    return this.store.selectSnapshot(AppConfigState.getApi(apiName));
  }

  handleError(err: any): Observable<any> {
    this.store.dispatch(new RestOccurError(err));
    return throwError(err);
  }

  // TODO: Deprecate service or improve interface in v3.0
  request<T, R>(
    request: HttpRequest<T> | RestModel.Request<T>,
    config?: RestModel.Config,
    api?: string,
  ): Observable<R> {
    config = config || ({} as RestModel.Config);
    api = api || this.getApiFromStore(config.apiName);
    const { method, params, ...options } = request;
    const { observe = RestModel.Observe.Body, skipHandleError } = config;

    return this.http
      .request<R>(method, api + request.url, {
        observe,
        ...(params && {
          params: Object.keys(params).reduce((acc, key) => {
            const value = params[key];

            if (!value) {
              return acc;
            }

            if (value === null && !this.options.sendNullsAsQueryParam) {
              return acc;
            }

            acc[key] = value;
            return acc;
          }, {}),
        }),
        ...options,
      } as any)
      .pipe(catchError(err => (skipHandleError ? throwError(err) : this.handleError(err))));
  }
}
