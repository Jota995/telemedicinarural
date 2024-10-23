import { Component, inject, OnInit } from '@angular/core';
import { RxDatabaseService } from '../../../../core/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { DataViewModule } from 'primeng/dataview';
import { AsyncPipe, DatePipe, NgClass, NgFor } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-agenda-resumen-periodo',
  standalone: true,
  imports: [DataViewModule,AsyncPipe, NgClass, NgFor, AvatarModule, DatePipe],
  templateUrl: './agenda-resumen-periodo.component.html',
  styleUrl: './agenda-resumen-periodo.component.css',
  providers:[RxDatabaseService]
})
export class AgendaResumenPeriodoComponent implements OnInit {
  private activateRotue = inject(ActivatedRoute)
  private dbService = inject(RxDatabaseService)

  public periodo!:string | null

  public citas$!:Observable<any>

  ngOnInit(): void {
    this.periodo = this.activateRotue.snapshot.paramMap.get('periodo')

    var periodoInicio:Date|null = null
    var periodoFin:Date|null = null
    
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

      this.citas$ = this.dbService
        .db
        .cita
        .find({
          selector:{
            fecha:{
              $gte: periodoInicio?.toISOString(),
              $lte: periodoFin?.toISOString() 
            }
          }
        })
        .$
        .pipe(
          tap(async (results) => {
            for (const cita of results || []) {
              cita.doctor = await this.dbService.db.doctor.findOne({
                  selector: { id: cita.idDoctor }
              }).exec();
            }
          })
        )
    }

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
