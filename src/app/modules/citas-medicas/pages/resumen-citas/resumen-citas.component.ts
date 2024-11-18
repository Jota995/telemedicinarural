import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { CitaType } from '../../../../core/models/cita.model'
import { CitaService } from '../../../../core/services/cita.service';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [AvatarModule,CardModule,ButtonModule, RouterModule,DatePipe,AsyncPipe],
  templateUrl: './resumen-citas.component.html',
  styleUrl: './resumen-citas.component.css',
  providers:[CitaService]
})
export class ResumenCitasComponent implements OnInit{
  private citaService = inject(CitaService)
  destroyRef = inject(DestroyRef);

  public citasProgramadasEnElMes!:Observable<number>;
  public proximasCitas:Array<CitaType> = [] ;

  ngOnInit(): void {
    this.citasProgramadasEnElMes = this.citaService
      .citasDelMes()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )

    const fechaActual = new Date()
    const diaSemanaActual = fechaActual.getDay();
    const ultimoDiaSemana = new Date(fechaActual);
    ultimoDiaSemana.setDate(fechaActual.getDate() + (7 - diaSemanaActual));

    this.citaService
      .obtenerCitas({fechaInicio:fechaActual,fechaTermino:ultimoDiaSemana, estado:'programada'})
      .then((citas) =>{
        console.log("proximas citas",citas)
        this.proximasCitas = citas
      })
  }

}
