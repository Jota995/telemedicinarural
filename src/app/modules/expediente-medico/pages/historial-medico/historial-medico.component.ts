import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { Observable, tap } from 'rxjs';
import { RxDatabaseService } from '../../../../core/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { HistorialMedicoType } from '../../../../core/models/historialmedico.model';
import { HistorialMedicoQueryParams, HistorialMedicoService } from '../../../../core/services/historial-medico.service';


@Component({
  selector: 'app-historial-medico',
  standalone: true,
  imports: [AvatarModule,AvatarGroupModule,CardModule,DataViewModule,CommonModule],
  templateUrl: './historial-medico.component.html',
  styleUrl: './historial-medico.component.css',
  providers:[HistorialMedicoService]
})
export class HistorialMedicoComponent implements OnInit {
  private historialMedicoService = inject(HistorialMedicoService)
  private activateRotue = inject(ActivatedRoute)
  
  public emmitedFirst = false;
  public historialMedico:HistorialMedicoType | null = null;
  private idHistorial:string | null = ''

  ngOnInit(): void {
    this.idHistorial = this.activateRotue.snapshot.paramMap.get('idHistorial')

    const historialQuery:HistorialMedicoQueryParams = {
      idHistorial: this.idHistorial || ''
    }

    console.log("historial query",historialQuery)
    
    this.historialMedicoService
      .obtenerHistorialMedico(historialQuery)
      .then((historial)=>{
        this.historialMedico = historial
        console.log("historial medico",this.historialMedico)
      })

  }

}
