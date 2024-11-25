import { Component, inject, Input, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AgendaQueryParams, AgendaService } from '../../../../core/services/agenda.service';
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

  @Input() especialidad:string | undefined = undefined;
  @Input() estado:"disponible"| "cancelada"| "completada"| "no_asistida"| "pendiente" | undefined = undefined;
  @Input() fechaDesde:Date | undefined = undefined
  @Input() fechaHasta:Date | undefined = undefined
  
  private agendaService = inject(AgendaService)

  public agendaMedica:Array<AgendaType> = []

  ngOnInit(): void {

    const query:AgendaQueryParams = {
      especialidad:this.especialidad,
      estado:this.estado,
      fechaDesde:this.fechaDesde,
      fechaHasta:this.fechaHasta
    } 

    this.agendaService
      .obtenerAgendas(query)
      .then((agenda) =>{
        this.agendaMedica = agenda;
      })
      .catch(error =>{
        console.log("error al obtener agenda medica",error)
      })
  }
}
