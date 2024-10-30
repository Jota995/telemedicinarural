import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CitaType } from '../../../../core/models/cita.model'
import { CitaService } from '../../../../core/services/cita.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [AvatarModule,CardModule,ButtonModule,RouterModule, AsyncPipe,DatePipe],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css',
  providers:[CitaService,Router]
})
export class AgendaComponent implements OnInit{
  private router = inject(Router)
  private citaService = inject(CitaService)

  public citasProgramadasEnElMes: number = 0;
  public proximasCitas:Array<CitaType> = [] ;

  ngOnInit(): void {
    this.citaService
      .citasDelMes()
      .then((citas) =>{
        this.citasProgramadasEnElMes = citas
      })

    const fechaActual = new Date()
    const diaSemanaActual = fechaActual.getDay();
    const ultimoDiaSemana = new Date(fechaActual);
    ultimoDiaSemana.setDate(fechaActual.getDate() + (7 - diaSemanaActual));

    this.citaService
      .obtenerCitas({fechaInicio:fechaActual,fechaTermino:ultimoDiaSemana})
      .then((citas) =>{
        console.log("proximas citas",citas)
        this.proximasCitas = citas
      })
  }

}
