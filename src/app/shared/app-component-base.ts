import { ConfigStateService, LocalizationService, SessionStateService } from '@abp/ng.core';
import { ElementRef, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export abstract class AppComponentBase {
  configService: ConfigStateService;
  sessionService: SessionStateService;
  localization: LocalizationService;
  translate: TranslateService;
  elementRef: ElementRef;

  constructor(injector: Injector) {
    this.configService = injector.get(ConfigStateService);
    this.sessionService = injector.get(SessionStateService);
    this.localization = injector.get(LocalizationService);
    this.elementRef = injector.get(ElementRef);
    this.translate = injector.get(TranslateService);
  }

  l(key: string, ...args: string[]): string {
    let localizedText = this.localization.instant(key, ...args);

    if (!localizedText) {
      localizedText = key;
    }

    return localizedText;
  }

  t(key: string, ...args: string[]): string {
    let localizedText = this.translate.instant(key, ...args);

    if (!localizedText) {
      localizedText = key;
    }

    return localizedText;
  }

  isGranted(permissionName: string): boolean {
    return this.configService.getGrantedPolicy(permissionName);
  }
}
