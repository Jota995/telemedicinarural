import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AgendaService } from '../../../../core/services/agenda.service';
import { AgendaType } from '../../../../core/models/agenda.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-resumen-agenda-medica',
  standalone: true,
  imports: [RouterModule,ButtonModule,DatePipe],
  templateUrl: './resumen-agenda-medica.component.html',
  styleUrl: './resumen-agenda-medica.component.css',
  providers:[AgendaService]
})
export class ResumenAgendaMedicaComponent implements OnInit {
  
  private agendaService = inject(AgendaService)

  public agendaMedica:Array<AgendaType> = []

  ngOnInit(): void {
    this.agendaService
      .obtenerAgendas({})
      .then((agenda) =>{
        this.agendaMedica = agenda;
      })
      .catch(error =>{
        console.log("error al obtener agenda medica")
      })
  }
}
