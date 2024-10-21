import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';
import { Observable, tap } from 'rxjs';
import { RxDatabaseService } from '../../../../core/services/database.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-historial-medico',
  standalone: true,
  imports: [AvatarModule,AvatarGroupModule,CardModule,DataViewModule,CommonModule],
  templateUrl: './historial-medico.component.html',
  styleUrl: './historial-medico.component.css',
  providers:[RxDatabaseService]
})
export class HistorialMedicoComponent implements OnInit {
  private databaseService = inject(RxDatabaseService)
  private activateRotue = inject(ActivatedRoute)
  
  public emmitedFirst = false;
  public historialMedico$!:Observable<any>;
  private idHistorial!:string | null

  ngOnInit(): void {
    this.idHistorial = this.activateRotue.snapshot.paramMap.get('idHistorial')
    
    this.historialMedico$ = this.databaseService.db.historialmedico.findOne({
      selector:{
        id: this.idHistorial
      }
    })
    .$
    .pipe(
      tap(async (result)=>{
        if(!this.emmitedFirst) this.emmitedFirst= true
        if (result) {
          result.paciente = await result.populate('idPaciente')

          for (const consulta of result.consultasMedicas || []) {
            consulta.doctor = await this.databaseService.db.doctor.findOne({
                selector: { id: consulta.idDoctor }
            }).exec();
          }

          console.log("result",result)
        }
      })
    )
  }

  public prescripcionesMedicas:Array<any> = [
    {
      medicamento:'Medicina A',
      dosis:'500mg'
    },
    {
      medicamento:'Medicina B',
      dosis:'500mg'
    }
  ]

  public notasDelDoctor:Array<any> = [
    {
      doctor:'Dr. Johnson',
      nota:'El paciente responde bien a la medicación.'
    },
    {
      doctor:'Dr. Smith',
      nota:'Se sugiere cita de seguimiento en dos semanas.'
    }
  ]


  public alergias = [
    {
      'nombre': 'Alergia Maní',
      'severidad': 'Alta'
    },
    {
      'nombre': 'Alergia Aspirina',
      'severidad': 'Baja'
    }
  ]

  public consultasMedicas = [
    {
      'doctor':'Dr. Johnson',
      'especialidad':'Dermatólogo',
      'fecha': '04/10/2024'
    },
    {
      'doctor':'Dr. Lee',
      'especialidad':'Cardiólogo',
      'fecha': '01/10/2024'
    }
  ]

  public estadisticasSalud =[
    {
      'nombre':'Presión Arterial',
      'medicion':'120/80',
      'porcentaje':'-5%'
    },
    {
      'nombre':'Frecuencia Cardiaca',
      'medicion':'70bpm',
      'porcentaje':'+2%'
    }
  ]
}
