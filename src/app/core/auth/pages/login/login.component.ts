import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../../services/alert.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule,PasswordModule,ButtonModule,IconFieldModule,InputIconModule,ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[AuthService,AlertService]
})
export class LoginComponent {
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)
  private alertServ = inject(AlertService)

  public form = this.fb.group({
    email:[null,[Validators.required,Validators.email]],
    password:[null,[Validators.required]]
  })

  async submit(){
    try {
      const value = this.form.getRawValue()
      const email = String(value.email)
      const password = String(value.password)
      await this.authService.login(email,password)
    } catch (error) {
      console.log("erro", error)
      this.alertServ.showWarn('Inicio seccion fallido.','Usuario o contraseña ingresados son incorrectos.')
    }
  }
}
