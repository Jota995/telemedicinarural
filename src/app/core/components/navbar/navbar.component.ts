import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule,AvatarModule,BadgeModule,CommonModule,ButtonModule,TieredMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers:[AuthService,UserService,Router]
})
export class NavbarComponent implements OnInit, OnDestroy {
  authService = inject(AuthService)
  userService = inject(UserService)
  router = inject(Router)

  items: MenuItem[] | undefined;
  userItems:MenuItem[] | undefined;
  user$!:Observable<User>

  ngOnInit(): void {
    console.log("navbar on init")
    this.user$= this.userService.getUser();

    this.items = [
            {
              label: 'Inicio',
              icon: 'pi pi-home',
              route:'/app/home'
            },
            {
              label: 'Citas Médicas',
              icon: 'pi pi-calendar',
              route:'/app/agenda/resumen'
            },
            {
              label:'Expedientes médicos',
              icon:'pi pi-folder-open',
              route:`/app/historial-medico/4f32e1f6-f67f-4e90-a2b4-20fc3ad5a6ee`
            }
        ];

    this.userItems =  [
      {
        label:'Ver Perfil',
        icon:'pi pi-user'
      },
      {
          label: 'Cerrar Session',
          icon: 'pi pi-sign-out',
          command: () => {this.authService.logout()}
      }
  ];
  }

  ngOnDestroy(): void {
    console.log("ejectutando navbar destroy")
  }
}
