import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLanguagesComponent } from './account-languages.component';

describe('AccountLanguagesComponent', () => {
  let component: AccountLanguagesComponent;
  let fixture: ComponentFixture<AccountLanguagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLanguagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
