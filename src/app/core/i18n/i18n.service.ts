// 请参考：https://ng-alain.com/docs/i18n
import { SessionStateService } from '@abp/ng.core';
import { registerLocaleData } from '@angular/common';
import ngEn from '@angular/common/locales/en';
import ngZh from '@angular/common/locales/zh';
import ngZhTw from '@angular/common/locales/zh-Hant';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import {
  AlainI18NService,
  DelonLocaleService,
  en_US as delonEnUS,
  SettingsService,
  zh_CN as delonZhCn,
  zh_TW as delonZhTw,
} from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { enUS as dfEn, zhCN as dfZhCn, zhTW as dfZhTw } from 'date-fns/locale';
import { en_US as zorroEnUS, NzI18nService, zh_CN as zorroZhCN, zh_TW as zorroZhTW } from 'ng-zorro-antd/i18n';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

interface LangData {
  text: string;
  ng: any;
  zorro: any;
  date: any;
  delon: any;
  abbr: string;
  culture: string;
}

const DEFAULT = 'zh-CN';
const DEFAULT_ABP_CULTURE = 'zh-Hans';

const LANGS: { [key: string]: LangData } = {
  'zh-CN': {
    text: '简体中文',
    ng: ngZh,
    zorro: zorroZhCN,
    date: dfZhCn,
    delon: delonZhCn,
    abbr: '🇨🇳',
    culture: 'zh-Hans',
  },
  'zh-TW': {
    text: '繁体中文',
    ng: ngZhTw,
    zorro: zorroZhTW,
    date: dfZhTw,
    delon: delonZhTw,
    abbr: '🇭🇰',
    culture: 'zh-Hant',
  },
  'en-US': {
    text: 'English',
    ng: ngEn,
    zorro: zorroEnUS,
    date: dfEn,
    delon: delonEnUS,
    abbr: '🇬🇧',
    culture: 'en',
  },
};

@Injectable({ providedIn: 'root' })
export class I18NService implements AlainI18NService {
  private _default = DEFAULT;
  private _defaultABPCulture = DEFAULT_ABP_CULTURE;
  private change$ = new BehaviorSubject<string | null>(null);

  private _langs = Object.keys(LANGS).map((code) => {
    const item = LANGS[code];
    return { code, text: item.text, abbr: item.abbr, culture: item.culture };
  });

  constructor(
    settings: SettingsService,
    private nzI18nService: NzI18nService,
    private delonLocaleService: DelonLocaleService,
    private translate: TranslateService,
    private sessionStateService: SessionStateService,
  ) {
    // `@ngx-translate/core` 预先知道支持哪些语言
    const lans = this._langs.map((item) => item.code);
    translate.addLangs(lans);

    const defaultLan = settings.layout.lang || translate.getBrowserLang();
    if (lans.includes(defaultLan)) {
      this._default = defaultLan;
    }

    this.updateLangData(this._default);
  }

  private updateLangData(lang: string) {
    const item = LANGS[lang];
    registerLocaleData(item.ng);
    this.nzI18nService.setLocale(item.zorro);
    this.nzI18nService.setDateLocale(item.date);
    this.delonLocaleService.setLocale(item.delon);
  }

  get change(): Observable<string> {
    return this.change$.asObservable().pipe(filter((w) => w != null)) as Observable<string>;
  }

  use(lang: string): void {
    lang = lang || this.translate.getDefaultLang();
    if (this.currentLang === lang) {
      return;
    }
    this.updateLangData(lang);
    this.translate.use(lang).subscribe(() => this.change$.next(lang));
  }

  /** 获取语言列表 */
  getLangs() {
    return this._langs;
  }
  /** 翻译 */
  fanyi(key: string, interpolateParams?: {}) {
    return this.translate.instant(key, interpolateParams);
  }
  /** 默认语言 */
  get defaultLang() {
    // 使用ABP的SessionStateService的getLanguage方法来获取当前默认语言
    const culcture = this.sessionStateService.getLanguage();
    return this.getLangByABPCulture(culcture);
  }

  /** ABP相关 */
  useABPCulture(culture: string): void {
    const lang = this.getLangByABPCulture(culture);
    this.use(lang);

    this.sessionStateService.dispatchSetLanguage(culture);
  }

  get defaultABPLangCulture() {
    for (const lang of this._langs) {
      if (lang.code === this.defaultLang) {
        return lang.culture;
      }
    }
    return DEFAULT_ABP_CULTURE;
  }

  private getLangByABPCulture(culture: string): string {
    if (culture) {
      for (const lang of this._langs) {
        if (lang.culture === culture) {
          return lang.code;
        }
      }
    }

    return DEFAULT;
  }

  /** 当前语言 */
  get currentLang() {
    return this.translate.currentLang || this.translate.getDefaultLang() || this._default;
  }
}
