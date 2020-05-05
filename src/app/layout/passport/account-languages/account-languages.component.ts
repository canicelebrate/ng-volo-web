import { ApplicationConfiguration, ConfigStateService, LocalizationService, SessionStateService, SetLanguage } from '@abp/ng.core';
import { Component, Injector, OnInit } from '@angular/core';
import { I18NService } from '@core/i18n/i18n.service';
import { Select, Store } from '@ngxs/store';
import { AppComponentBase } from '@shared/app-component-base';

@Component({
  selector: 'passport-account-languages',
  templateUrl: './account-languages.component.html',
  styleUrls: ['./account-languages.component.less'],
})
export class AccountLanguagesComponent extends AppComponentBase implements OnInit {
  constructor(
    private store: Store,
    private configStateService: ConfigStateService,
    private sessionStateService: SessionStateService,
    private i18nService: I18NService,
    injector: Injector,
  ) {
    super(injector);
  }

  languages: ApplicationConfiguration.Language[];
  currentLanguage: string;

  ngOnInit(): void {
    this.languages = this.configStateService.getDeep('localization.languages') as ApplicationConfiguration.Language[];
    this.currentLanguage = this.sessionStateService.getLanguage();
  }

  changeLanguage(languageName: string): void {
    this.i18nService.useABPCulture(languageName);
    location.reload();
  }
}
