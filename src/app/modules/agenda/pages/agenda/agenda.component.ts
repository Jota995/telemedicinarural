import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { RxDatabaseService } from '../../../../core/services/database.service';
import { AsyncPipe, DatePipe } from '@angular/common';

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

  public tipo_citas:Array<string> = ['citas del dia','citas de la semana', 'citas del mes']
  public citasProgramadasEnElMes$!: Observable<any>;
  public proximasCitas$!:Observable<any>;

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
  }

}
