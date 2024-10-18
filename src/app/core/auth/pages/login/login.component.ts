import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule,PasswordModule,ButtonModule,IconFieldModule,InputIconModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[AuthService]
})
export class LoginComponent {
  private authService = inject(AuthService)
  private fb:FormBuilder = inject(FormBuilder)

  public form = this.fb.group({
    email:[null,[Validators.required,Validators.email]],
    password:[null,[Validators.required]]
  })

  submit(){
    const value = this.form.getRawValue()
    const email = String(value.email)
    const password = String(value.password)
    this.authService.login(email,password)
  }
}
