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
import { RxDatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule,AvatarModule,BadgeModule,CommonModule,ButtonModule,TieredMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers:[AuthService,UserService]
})
export class NavbarComponent implements OnInit, OnDestroy {
  authService = inject(AuthService)
  userService = inject(UserService)

  items: MenuItem[] | undefined;
  userItems:MenuItem[] | undefined;
  user$!:Observable<User>

  constructor(){
  }

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
          route:'/app/citas-medicas/resumen'
        },
        {
          label:'Agenda Medica',
          icon:'pi pi-address-book',
          route:'/app/agenda-medica'
        },
        {
          label:'Expedientes médicos',
          icon:'pi pi-folder-open',
          route:`/app/historial-medico/6726903ff2f5e67b572472a0`
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
