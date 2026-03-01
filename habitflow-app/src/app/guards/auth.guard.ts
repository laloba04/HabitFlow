import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Protects routes that require authentication.
   * Takes one emission from the auth stream to avoid dangling subscriptions.
   * If no user is authenticated, redirects to /login.
   */
  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) {
          // User is logged in — allow navigation
          return true;
        }
        // No authenticated user — redirect to login
        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
