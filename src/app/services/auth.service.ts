import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = new BehaviorSubject<Observable<firebase.User | null>>(of(null));

  user$ = this.user.asObservable().pipe(switchMap((user: Observable<firebase.User | null>) => user));

  constructor(private angularFireAuth: AngularFireAuth) {
    this.user.next(this.angularFireAuth.authState);
  }

  loginViaGoogle(): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()));
  }

  logout(): Observable<void> {
    return from(this.angularFireAuth.signOut());
  }
}
