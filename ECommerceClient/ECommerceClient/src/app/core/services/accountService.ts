import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Address, User } from '../../shared/models/user';
import { map, tap, catchError } from 'rxjs/operators';
import { lastValueFrom, of } from 'rxjs';
import { SignalrService } from './signalrService';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  currentUser = signal<User | null>(null);
  private signalrService = inject(SignalrService);

  isAdmin = computed(() => {
    const roles = this.currentUser()?.roles;
    return Array.isArray(roles) ? roles.includes('Admin') : roles === 'Admin';
  });

  login(values: any) {
    const params = new HttpParams().append('useCookies', true);
    return this.http.post<User>(this.baseUrl + 'login', values, { params }).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.signalrService.createHubConnection();
      })
    );
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values);
  }

  getUserInfo() {
    return this.http.get<User>(this.baseUrl + 'account/user-info').pipe(
      map(user => {
        this.currentUser.set(user);
        return user;
      })
    );
  }

  logout() {
    return this.http.post(this.baseUrl + 'account/logout', {}).pipe(
      tap(() => {
        this.currentUser.set(null);
        this.signalrService.stopHubConnection();
      })
    );
  }

  updateAddress(address: Address) {
    return this.http.post(this.baseUrl + 'account/address', address).pipe(
      tap(() => {
        this.currentUser.update(user => {
          if (user) user.address = address;
          return user;
        });
      })
    );
  }

  getAuthState() {
    return this.http.get<{ isAuthenticated: boolean }>(this.baseUrl + 'account/auth-status');
  }

  async loadUserFromStorage(): Promise<void> {
    try {
      const authStatus = await lastValueFrom(
        this.getAuthState().pipe(
          catchError(() => of({ isAuthenticated: false }))
        )
      );

      if (authStatus.isAuthenticated) {
        await lastValueFrom(
          this.getUserInfo().pipe(
            catchError(() => {
              this.currentUser.set(null);
              return of(null);
            })
          )
        );

        if (this.currentUser()) {
          this.signalrService.createHubConnection();
        }
      } else {
        this.currentUser.set(null);
      }
    } catch {
      this.currentUser.set(null);
    }
  }
}