import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SettingsService } from '@delon/theme';

import { Profile, ProfileState, ProfileStateService } from '@abp/ng.core';
import { Action, Select, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'layout-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @Select(ProfileState.getProfile)
  profile$: Observable<Profile.Response>;

  constructor(public settings: SettingsService, private profileStateService: ProfileStateService) {}

  ngOnInit(): void {
    // fetch profile information
    this.profileStateService.dispatchGetProfile().subscribe((resp) => {
      console.log('Dispatched GetProfile Action to store!');
    });
  }
}
