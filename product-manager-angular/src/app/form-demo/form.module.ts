import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveComponent } from './reactive.component';
import { RouterModule } from '@angular/router';
import { FormNavComponent } from '../form-nav/form-nav.component';
import { TemplateDrivenComponent } from './template-driven.component';

@NgModule({
  declarations: [ReactiveComponent, FormNavComponent, TemplateDrivenComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'form',
        children: [
          { path: 'template-form', component: TemplateDrivenComponent },
          { path: 'reactive', component: ReactiveComponent },
          { path: '', redirectTo: 'reactive', pathMatch: 'full' },
        ],
      },
    ]),
  ],
  bootstrap: [FormNavComponent],
})
export class Forms_Module {}
