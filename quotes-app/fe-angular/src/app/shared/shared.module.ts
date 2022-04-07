import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  // declarations: [],
  imports: [CommonModule],
  exports: [FormsModule, CommonModule, NgbModule],
})
export class SharedModule {}
