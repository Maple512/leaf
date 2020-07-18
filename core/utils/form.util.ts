import { ModelCommon } from '../models';
import { isNumber } from './number.util';

// tslint:disable-next-line:variable-name
export function mapEnumToOptions<T>(_enum: T): ModelCommon.Option<T>[] {
  const options: ModelCommon.Option<T>[] = [];

  for (const member in _enum) {
    if (!isNumber(member)) {
      options.push({
        key: member,
        value: _enum[member],
      });
    }
  }

  return options;
}
