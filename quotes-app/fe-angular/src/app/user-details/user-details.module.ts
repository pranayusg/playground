import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { UserHeadingComponent } from '../user-heading/user-heading.component';
import { UserDetailsComponent } from './user-details.component';
import { RouterModule } from '@angular/router';
import { UserDetailsGuard } from './user-details.guard';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserDetailsComponent,
    UserHeadingComponent,
    UserSettingsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        children: [
          {
            path: '',
            canActivate: [UserDetailsGuard],
            component: UserDetailsComponent,
          },
        ],
      },
    ]),
  ],
})
export class UserDetailsModule {}
