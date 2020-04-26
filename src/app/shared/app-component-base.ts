import { ConfigStateService, LocalizationService, SessionStateService } from '@abp/ng.core';
import { ElementRef, Injector } from '@angular/core';

export abstract class AppComponentBase {
  configService: ConfigStateService;
  sessionService: SessionStateService;
  localization: LocalizationService;
  elementRef: ElementRef;

  constructor(injector: Injector) {
    this.configService = injector.get(ConfigStateService);
    this.sessionService = injector.get(SessionStateService);
    this.localization = injector.get(LocalizationService);
    this.elementRef = injector.get(ElementRef);
  }

  l(key: string, ...args: string[]): string {
    let localizedText = this.localization.instant(key, ...args);

    if (!localizedText) {
      localizedText = key;
    }

    return localizedText;
  }

  isGranted(permissionName: string): boolean {
    return this.configService.getGrantedPolicy(permissionName);
  }
}
