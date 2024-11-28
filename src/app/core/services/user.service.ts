import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { User } from '../models/user.model';
import { AuthService } from '../auth/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn:'root'
})
export class UserService {
  private user!:BehaviorSubject<User>;
  private authService = inject(AuthService);
  private userValue:User | null = null;

  constructor() { 
    if(!this.authService.isAuthenticated() || !this.authService.getUserBearerToken())
      return

    const userToken = this.authService.getUserBearerToken()
    const tokenPayload = this.getTokenPayload(userToken)

    console.log("token payload",tokenPayload)

    this.userValue = {
      UserId: tokenPayload?.Sub,
      Email: tokenPayload?.email,
      Name: tokenPayload?.name,
      Role: tokenPayload?.Role,
      IdDoctor: tokenPayload?.idDoctor,
      IdPaciente: tokenPayload?.idPaciente
    }

    console.log("usuario registrado", this.userValue)

    this.user = new BehaviorSubject<User>(this.userValue)
  }

  getUser$(){
    return this.user.asObservable();
  }

  getUserValue(){
    return this.userValue
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
