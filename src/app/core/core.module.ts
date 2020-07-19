import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, Injector, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule, NGXS_PLUGINS } from '@ngxs/store';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { AutofocusDirective } from './directives/auto-focus.directive';
import { InputEventDebounceDirective } from './directives/debounce.directive';
import { throwIfAlreadyLoaded } from './guards/module-import.guard';
import { ApiInterceptor } from './interceptors/api.interceptor';
import { LocalizationModule } from './localization.module';
import { ModelCommon } from './models/common.model';
import { LocalizationPipe, MockLocalizationPipe } from './pipes/localization.pipe';
import { ConfigPlugin, NGXS_CONFIG_PLUGIN_OPTIONS } from './plugins/config.plugin';
import { LocaleProvider } from './providers/locale.provider';
import { LocalizationService } from './services/localization.service';
import { AppConfigState } from './states/config.state';
import { ProfileState } from './states/profile.state';
import { SessionState } from './states/session.state';
import { CORE_OPTIONS } from './tokens/options.token';
import { noop } from './utils/common.util';
import { configureOAuth, getInitialData, localeInitializer } from './utils/initial.util';

export function storageFactory(): OAuthStorage {
  return localStorage;
}

// directive's
const DIRECTIVES = [
  AutofocusDirective,
  InputEventDebounceDirective
];

// state's
const STATES = [
  ProfileState, SessionState, AppConfigState
];

/**
 * BaseCoreModule is the module that holds
 * all imports, declarations, exports, and entryComponents
 * but not the providers.
 * This module will be imported and exported by all others.
 */
@NgModule({
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...DIRECTIVES,
  ],
  imports: [
    OAuthModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [
    ...DIRECTIVES,
  ],
  entryComponents: [
  ],
})
export class BaseCoreModule { }

/**
 * RootCoreModule is the module that will be used at root level
 * and it introduces imports useful at root level (e.g. NGXS)
 */
@NgModule({
  exports: [BaseCoreModule, LocalizationModule],
  imports: [
    BaseCoreModule,
    LocalizationModule,
    NgxsModule.forFeature([...STATES]),
    NgxsRouterPluginModule.forRoot(),
    NgxsStoragePluginModule.forRoot({ key: ['SessionState'] }),
    OAuthModule.forRoot(),
  ],
})
export class RootCoreModule { }

/**
 * TestCoreModule is the module that will be used in tests
 * and it provides mock alternatives
 */
@NgModule({
  exports: [RouterModule, BaseCoreModule, MockLocalizationPipe],
  imports: [RouterModule.forRoot([]), BaseCoreModule],
  declarations: [MockLocalizationPipe],
})
export class TestCoreModule { }

/**
 * CoreModule is the module that is publicly available
 */
@NgModule({
  exports: [BaseCoreModule, LocalizationModule],
  imports: [BaseCoreModule, LocalizationModule],
  providers: [LocalizationPipe],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
  static forTest({ baseHref = '/' } = {} as ModelCommon.TestOptions): ModuleWithProviders<TestCoreModule> {
    return {
      ngModule: TestCoreModule,
      providers: [
        { provide: APP_BASE_HREF, useValue: baseHref },
        {
          provide: LocalizationPipe,
          useClass: MockLocalizationPipe,
        },
      ],
    };
  }

  static forRoot(options = {} as ModelCommon.RootOptions): ModuleWithProviders<RootCoreModule> {
    return {
      ngModule: RootCoreModule,
      providers: [
        LocaleProvider,
        {
          provide: NGXS_PLUGINS,
          useClass: ConfigPlugin,
          multi: true,
        },
        {
          provide: NGXS_CONFIG_PLUGIN_OPTIONS,
          useValue: { environment: options.environment },
        },
        {
          provide: CORE_OPTIONS,
          useValue: options,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiInterceptor,
          multi: true,
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          deps: [Injector, NGXS_CONFIG_PLUGIN_OPTIONS],
          useFactory: configureOAuth,
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          deps: [Injector],
          useFactory: getInitialData,
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          deps: [Injector],
          useFactory: localeInitializer,
        },
        {
          provide: APP_INITIALIZER,
          multi: true,
          deps: [LocalizationService],
          useFactory: noop,
        },
        { provide: OAuthStorage, useFactory: storageFactory },
      ],
    };
  }
}
