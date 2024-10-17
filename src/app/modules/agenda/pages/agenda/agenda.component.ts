import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [AvatarModule,CardModule,ButtonModule],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent {
  public tipo_citas:Array<string> = ['citas del dia','citas de la semana', 'citas del mes']
  public proximas_citas:Array<string> = ['Hoy, 3:00 PM','Viernes, 10:00 AM']
}
