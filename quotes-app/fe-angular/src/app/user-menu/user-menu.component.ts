import { Component, OnInit } from '@angular/core';
import { auth } from '../shared/authHelper';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css'],
})
export class UserMenuComponent implements OnInit {
  username = auth.getUsername();
  constructor() {}

  ngOnInit(): void {}
}
