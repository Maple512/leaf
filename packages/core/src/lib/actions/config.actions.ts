import { AppConfig } from '../configs';

export class GetAppConfiguration {
  static readonly type = '[Config] Get App Configuration';
}

export class SetEnvironment {
  static readonly type = '[Config] Set Environment';
  constructor(public environment: AppConfig.Environment) { }
}
