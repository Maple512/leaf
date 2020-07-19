import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { LocalizationPipe } from './pipes/localization.pipe';

@NgModule({
  exports: [LocalizationPipe],
  declarations: [LocalizationPipe],
})
export class LocalizationModule {
  constructor(@Optional() @SkipSelf() parentModule: LocalizationModule) {
    throwIfAlreadyLoaded(parentModule, 'LocalizationModule');
  }
}
