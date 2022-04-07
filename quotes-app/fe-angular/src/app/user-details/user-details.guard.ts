import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { auth } from '../shared/authHelper';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (auth.isLoggedIn()) {
      return true;
    }
    alert('Please log in to access this route');
    this.router.navigate(['/']);
    return false;
  }
}
