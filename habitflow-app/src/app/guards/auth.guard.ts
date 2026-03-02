import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      filter(() => this.authService.isAuthInitialized()),
      take(1),
      map(user => user ? true : this.router.createUrlTree(['/login']))
    );
  }
}
