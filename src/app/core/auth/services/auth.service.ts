import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment} from '../../../../environments/environment'
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private baseUrl:string = environment.apiBaseUrl
  private tokenKey = 'authToken';

  private http = inject(HttpClient)
  private router = inject(Router)

  constructor() { }

  async login(email:string,password:string):Promise<void>{
    const body = {email,password}
    const {token} = await firstValueFrom(this.http.post<any>(`${this.baseUrl}/api/Account/login`,body))
    localStorage.setItem(this.tokenKey, token);
    this.router.navigate(['/app/home'])
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  getUserBearerToken():string|null{
    const token =  localStorage.getItem(this.tokenKey);
  
    return token;
  }

  logout(): void {
    // Eliminar el token del localStorage
    localStorage.removeItem(this.tokenKey);
    // Redirigir al usuario a la página de login
    this.router.navigate(['/auth/login']);
  }

}
