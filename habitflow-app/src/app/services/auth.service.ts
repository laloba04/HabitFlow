import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Auth, onAuthStateChanged, signInWithEmailAndPassword,
         createUserWithEmailAndPassword, signOut, User,
         updateProfile } from '@angular/fire/auth';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$: Observable<AppUser | null> = this.currentUserSubject.asObservable();

  private authStateUnsubscribe: (() => void) | null = null;
  private authInitialized = false;

  constructor(private auth: Auth) {
    this.authStateUnsubscribe = onAuthStateChanged(this.auth, (firebaseUser: User | null) => {
      this.authInitialized = true;
      if (firebaseUser) {
        this.currentUserSubject.next({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName
        });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  isAuthInitialized(): boolean {
    return this.authInitialized;
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string, displayName?: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
      this.currentUserSubject.next({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName
      });
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser(): AppUser | null {
    return this.currentUserSubject.getValue();
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.getValue() !== null;
  }

  ngOnDestroy(): void {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
    }
  }
}
