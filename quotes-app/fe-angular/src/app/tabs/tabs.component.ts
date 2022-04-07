import { Component, OnInit } from '@angular/core';
import { auth } from '../shared/authHelper';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent implements OnInit {
  tagTab = '';
  showTagTab = false;
  active = 1;
  isLoggedIn = auth.isLoggedIn();

  constructor() {}

  ngOnInit(): void {}

  onTagClicked(tag: string) {
    this.tagTab = tag;
    this.showTagTab = true;
    this.active = 3;
  }

  onNavChange() {
    if (this.active === 3) this.showTagTab = false;
  }
}
