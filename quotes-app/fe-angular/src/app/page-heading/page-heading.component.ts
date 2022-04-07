import { Component, OnInit } from '@angular/core';
import { auth } from '../shared/authHelper';

@Component({
  selector: 'app-page-heading',
  templateUrl: './page-heading.component.html',
  styleUrls: ['./page-heading.component.css'],
})
export class PageHeadingComponent implements OnInit {
  isLoggedIn = auth.isLoggedIn();

  constructor() {}

  ngOnInit(): void {}
}
