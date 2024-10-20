import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MenubarModule,AvatarModule,BadgeModule,CommonModule,ButtonModule,TieredMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  providers:[AuthService,UserService]
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService)
  userService = inject(UserService)

  items: MenuItem[] | undefined;
  userItems:MenuItem[] | undefined;
  user$!:Observable<User>

  ngOnInit(): void {
    this.user$= this.userService.getUser();

    this.items = [
            {
                label: 'Home',
                icon: 'pi pi-home'
            },
            {
                label: 'Features',
                icon: 'pi pi-star'
            },
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
}
