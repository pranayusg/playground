import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from '../shared/authHelper';

@Component({
  selector: 'app-user-heading',
  templateUrl: './user-heading.component.html',
  styleUrls: ['./user-heading.component.css'],
})
export class UserHeadingComponent implements OnInit {
  username = auth.getUsername();
  constructor(private router: Router) {}

  ngOnInit(): void {}

  logOut() {
    auth.clearSession();
    this.router.navigate(['/']);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
