import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-resumen-agenda-medica',
  standalone: true,
  imports: [RouterModule,ButtonModule],
  templateUrl: './resumen-agenda-medica.component.html',
  styleUrl: './resumen-agenda-medica.component.css'
})
export class ResumenAgendaMedicaComponent {

}
