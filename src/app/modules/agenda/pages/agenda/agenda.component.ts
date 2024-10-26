import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { map, Observable, tap,  switchMap, from } from 'rxjs';
import { RxDatabaseService } from '../../../../core/services/database.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CitaType, RxCitaDocType } from '../../../../core/models/cita.model'
import { DoctorType } from '../../../../core/models/doctor.model';
import { PacienteType } from '../../../../core/models/paciente.model';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [AvatarModule,CardModule,ButtonModule,RouterModule, AsyncPipe,DatePipe],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css',
  providers:[RxDatabaseService]
})
export class AgendaComponent implements OnInit{
  private dbService = inject(RxDatabaseService)

  public citasProgramadasEnElMes$!: Observable<number>;
  public proximasCitas$!:Observable<Array<CitaType> | null> ;

  ngOnInit(): void {
    const fechaActual = new Date();
  
    // Obtener el primer día del mes
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    
    // Obtener el último día del mes
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    this.citasProgramadasEnElMes$= this.dbService
      .db
      .cita
      .count({
        selector:{
          fecha:{
            $gte: primerDiaMes.toISOString(),
            $lte: ultimoDiaMes.toISOString() 
          }
        }
      })
      .$

    const diaSemanaActual = fechaActual.getDay();
    const ultimoDiaSemana = new Date(fechaActual);
    ultimoDiaSemana.setDate(fechaActual.getDate() + (7 - diaSemanaActual));

    this.proximasCitas$ = this.dbService
      .db
      .cita
      .find(
        {
          selector:{
            fecha:{
              $gte: fechaActual.toISOString(),
              $lte: ultimoDiaSemana.toISOString() 
            }
          }
        }
      )
      .$
      .pipe(
        switchMap((RxCitas) => 
          from((async () => {
            const citas: Array<CitaType> = [];
            let doctor: DoctorType | null = null;
            let paciente: PacienteType | null = null;
    
            for (const rxCita of RxCitas || []) {
              const rxDoctor = await this.dbService.db.doctor.findOne({
                selector: {
                  id: rxCita.idDoctor
                }
              }).exec();
    
              if (rxDoctor) {
                doctor = { ...rxDoctor };
              }
    
              const rxPaciente = await this.dbService.db.paciente.findOne({
                selector: {
                  id: rxCita.idPaciente
                }
              }).exec();
    
              if (rxPaciente) {
                paciente = { ...rxPaciente };
              }
    
              const cita: CitaType = {
                ...rxCita,
                doctor,
                paciente
              };
    
              citas.push(cita);
            }
    
            return citas;
          })())
        )
      );
  }

}
