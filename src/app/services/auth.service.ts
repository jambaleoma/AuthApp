import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, switchMap } from 'rxjs';
import { endpoints } from 'src/environments/endpoints';
import { environment } from 'src/environments/environment';
import { User } from '../model/user.model';
import { Router, UrlTree } from '@angular/router';

export const USER_STORAGE = 'USER_STORAGE';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: BehaviorSubject<User | null | undefined> = new BehaviorSubject<User | null | undefined>(undefined);

  constructor(
    private http: HttpClient
  ) {
    this.loadUser();
  }

  loadUser() {
    const userString = localStorage.getItem(USER_STORAGE);
    if (userString) {
      const user: User = JSON.parse(userString);
      if (user && user.token) {
        console.log('🚀Token🌍: '+ user.token);
        this.user.next(user);
      }  else {
        this.user.next(null);
      }
    } else {
      this.user.next(null);
    }
  }

  register(user: User) {
    return this.http.post(environment.baseUrl + endpoints.users, {
      user
    })
    .pipe(
      switchMap((res: any) => {
        return this.login(user.email, user.password);
      })
    )
  }

  login(email: string | undefined, password: string | undefined) {
    return this.http.post(environment.baseUrl + endpoints.login, {
      email,
      password
    }).pipe(
      map((res: any) => {
        console.log('Result: ', res);
        localStorage.setItem(USER_STORAGE, JSON.stringify(res));
        const userData: User = {
          firstName: res.firstName,
          lastName: res.lastName,
          password: res.password,
          email: res.email,
          id: res.id,
          token: res.token,
          exp: res.exp
        }
        this.user.next(userData);
        return userData;  
      })
    )
  }

  signOut() {
    localStorage.removeItem(USER_STORAGE);
    this.user.next(null);
  }

  getCurrentUser() {
    return this.user.asObservable();
  }

  getCurrentUserId() {
    return this.user.getValue()?.id;
  }

  isLoggedIn(): Observable<boolean | UrlTree> {
    const router = inject(Router);

    return this.getCurrentUser().pipe(
      filter((user) => user !== undefined),
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } else {
          return router.createUrlTree(['/']);
        }
      })
    )
  }

}
