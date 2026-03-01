import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Placeholder user interface — will be replaced with Firebase User once Firebase is configured
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // BehaviorSubject holds the current user state; null means logged out
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);

  /** Observable stream of the authenticated user. Subscribe to react to auth state changes. */
  currentUser$: Observable<AppUser | null> = this.currentUserSubject.asObservable();

  constructor() {}

  /**
   * Sign in with email and password.
   * TODO: Replace with Firebase Auth signInWithEmailAndPassword.
   */
  async login(email: string, password: string): Promise<void> {
    throw new Error('login() not yet implemented — awaiting Firebase configuration');
  }

  /**
   * Create a new account with email and password.
   * TODO: Replace with Firebase Auth createUserWithEmailAndPassword.
   */
  async register(email: string, password: string): Promise<void> {
    throw new Error('register() not yet implemented — awaiting Firebase configuration');
  }

  /**
   * Sign out the current user.
   * TODO: Replace with Firebase Auth signOut.
   */
  async logout(): Promise<void> {
    this.currentUserSubject.next(null);
  }

  /**
   * Returns the current user snapshot (synchronous).
   * Use currentUser$ for reactive bindings.
   */
  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.getValue();
  }

  /**
   * Returns true if a user is currently authenticated.
   */
  isAuthenticated(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }
}
