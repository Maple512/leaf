import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppConfig } from '../configs';
import { AppConfigState } from '../states';

@Injectable()
@Pipe({
  name: 'localization',
})
export class LocalizationPipe implements PipeTransform {
  constructor(private store: Store) { }

  transform(
    value: string | AppConfig.LocalizationWithDefault = '',
    ...interpolateParams: string[]
  ): string {
    return this.store.selectSnapshot(
      AppConfigState.getLocalization(
        value,
        ...interpolateParams.reduce(
          (acc, val) => (Array.isArray(val) ? [...acc, ...val] : [...acc, val]),
          [],
        ),
      ),
    );
  }
}

@Injectable()
@Pipe({
  name: 'localization',
})
export class MockLocalizationPipe implements PipeTransform {
  transform(value: string | AppConfig.LocalizationWithDefault = '', ..._: string[]) {
    return typeof value === 'string' ? value : value.defaultValue;
  }
}
