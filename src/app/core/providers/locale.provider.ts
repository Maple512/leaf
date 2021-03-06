import { LOCALE_ID, Provider } from '@angular/core';
import localesMapping from '../consts/locale.consts';
import { LocalizationService } from '../services';

export class LocaleId extends String {
  constructor(private localizationService: LocalizationService) {
    super();
  }

  toString(): string {
    const { currentLang } = this.localizationService;
    return localesMapping[currentLang] || currentLang;
  }

  valueOf(): string {
    return this.toString();
  }
}

export const LocaleProvider: Provider = {
  provide: LOCALE_ID,
  useClass: LocaleId,
  deps: [LocalizationService],
};
