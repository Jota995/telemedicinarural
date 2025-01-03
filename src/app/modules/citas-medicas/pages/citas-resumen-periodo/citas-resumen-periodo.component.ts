import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataViewModule } from 'primeng/dataview';
import { AsyncPipe, DatePipe, NgClass, NgFor } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { CitaService } from '../../../../core/services/cita.service';
import { CitaType } from '../../../../core/models/cita.model';

@Component({
  selector: 'app-agenda-resumen-periodo',
  standalone: true,
  imports: [DataViewModule, AvatarModule, DatePipe],
  templateUrl: './citas-resumen-periodo.component.html',
  styleUrl: './citas-resumen-periodo.component.css',
  providers:[CitaService]
})
export class CitaResumenPeriodoComponent implements OnInit {
  private activateRotue = inject(ActivatedRoute)
  private citaService = inject(CitaService)

  public periodo!:string | null

  public citas:Array<CitaType> = []

  ngOnInit(): void {
    this.periodo = this.activateRotue.snapshot.paramMap.get('periodo')

    var periodoInicio:Date = new Date
    var periodoFin:Date = new Date
    
    if(this.periodo){
      switch(this.periodo){
        case 'dia':
          const dia = this.obtenerPeriodoHoy();
          periodoInicio = dia.inicio
          periodoFin = dia.fin
          break;
        case 'semana':
          const semana = this.obtenerPeriodoSemanaActual();
          periodoInicio = semana.inicio
          periodoFin = semana.fin
          break;
        case 'mes':
          const mes = this.obtenerPeriodoMesActual();
          periodoInicio = mes.inicio,
          periodoFin = mes.fin
          break;
        default:
          break;
      }

      this.obtenerCitas(periodoInicio,periodoFin)
    }

  }

  async obtenerCitas(fechaInicio:Date,fechaTermino:Date){
    this.citas = await this.citaService.obtenerCitas({
      fechaInicio:fechaInicio,
      fechaTermino: fechaTermino,
      ordenamiento:'asc'
    })
  }

  obtenerPeriodoHoy() {
    const ahora = new Date();
    
    // Inicio del día actual (00:00:00)
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0, 0);
  
    // Fin del día actual (23:59:59)
    const fin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59, 999);
  
    return { inicio, fin };
  }

  obtenerPeriodoSemanaActual() {
    const ahora = new Date();
    
    // Día de la semana actual (0=domingo, 1=lunes, ..., 6=sábado)
    const diaSemana = ahora.getDay();
    
    // Calcular el lunes (si es domingo, restamos 6 días, si es lunes, restamos 0 días)
    const lunes = new Date(ahora);
    const ajusteLunes = diaSemana === 0 ? -6 : 1 - diaSemana;
    lunes.setDate(ahora.getDate() + ajusteLunes);
    lunes.setHours(0, 0, 0, 0);  // Inicio del lunes a las 00:00:00
  
    // Calcular el domingo (6 días después del lunes)
    const domingo = new Date(lunes);
    domingo.setDate(lunes.getDate() + 6);
    domingo.setHours(23, 59, 59, 999);  // Fin del domingo a las 23:59:59
  
    return { inicio: lunes, fin: domingo };
  }

  obtenerPeriodoMesActual() {
    const ahora = new Date();
  
    // Inicio del mes actual (día 1, 00:00:00)
    const inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0, 0);
  
    // Fin del mes actual (último día del mes, 23:59:59)
    const fin = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0, 23, 59, 59, 999);
  
    return { inicio, fin };
  }
}
