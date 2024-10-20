import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../auth/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class UserService {
  private user!:BehaviorSubject<User>;
  private authService = inject(AuthService);

  constructor() { 
    if(!this.authService.isAuthenticated() || !this.authService.getUserBearerToken())
      return

    const userToken = this.authService.getUserBearerToken()
    const tokenPayload = this.getTokenPayload(userToken)

    console.log("token payload",tokenPayload)

    const user:User = {
      UserId: tokenPayload?.Sub,
      Email: tokenPayload?.email,
      Name: tokenPayload?.name,
      Role: tokenPayload?.Role
    }

    this.user = new BehaviorSubject<User>(user)
  }

  getUser(){
    return this.user.asObservable();
  }

  getTokenPayload(token:string| null){
    try {
      if(!token) return
      const helper = new JwtHelperService();
      const tokenPayload = helper.decodeToken(token)
      return tokenPayload;
    } catch (error) {
      console.log("error ", error)
      return null
    }
  }


}
