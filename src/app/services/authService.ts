import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, user } from "@angular/fire/auth";
import { signOut } from 'firebase/auth';
import { catchError, from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public auth = inject(Auth);

  // Observable for current user state
  user$ = user(this.auth);

  register(email:string, password:string): Observable<any> {
    return from(createUserWithEmailAndPassword(this.auth,email, password)).pipe(
      map(userCredential => userCredential.user),
      catchError( error => { throw error })
    );
  }

  login(email:string, password:string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth,email,password)).pipe(
      map(userCredential => userCredential.user),
      catchError( error => { throw error })
    )
  }

  loginWithGoogle():Observable<any> {
    const provider = new GoogleAuthProvider();
    return from(signInWithPopup(this.auth, provider)).pipe(
      map(userCredential => userCredential.user),
      catchError( error => { throw error })
    )
  }

  logout():Observable<any> {
    return from(signOut(this.auth)).pipe(
      catchError( error => {throw error} )
    )
  }
}
