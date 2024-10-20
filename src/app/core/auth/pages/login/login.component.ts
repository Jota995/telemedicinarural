import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import { MessagesModule } from 'primeng/messages';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule,PasswordModule,ButtonModule,IconFieldModule,InputIconModule,ReactiveFormsModule,MessagesModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[AuthService]
})
export class LoginComponent {
  private authService = inject(AuthService)
  private fb = inject(FormBuilder)

  public messages:Array<Message>  = []

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
      const message:Message = {
        severity:'warn',
        summary:'Usuario o contraseña incorrectos.'
      }
      this.messages.push(message)
    }
  }
}
