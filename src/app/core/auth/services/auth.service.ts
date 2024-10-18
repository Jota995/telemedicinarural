import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment} from '../../../../environments/environment'
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  private baseUrl:string = environment.apiBaseUrl
  private tokenKey = 'authToken';

  private http = inject(HttpClient)
  private router = inject(Router)

  constructor() { }

  login(email:string,password:string){
    try {
      const token = '12312'
      localStorage.setItem(this.tokenKey, token);
      console.log("naivage")
      this.router.navigate(['/app/home'])
    } catch (error) {
      
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  logout(): void {
    // Eliminar el token del localStorage
    localStorage.removeItem(this.tokenKey);
    // Redirigir al usuario a la página de login
    this.router.navigate(['/auth/login']);
  }

}
