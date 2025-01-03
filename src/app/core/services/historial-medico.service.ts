import { inject, Injectable } from '@angular/core';
import { RxDatabaseService } from './database.service';
import { PacienteService } from './paciente.service';
import { CitaService, CitasQueryParams } from './cita.service';
import { HistorialMedicoType, RxHistorialMedicoDocType } from '../models/historialmedico.model';
import { CitaType } from '../models/cita.model';
import { PacienteType } from '../models/paciente.model';


export type HistorialMedicoQueryParams ={
  idPaciente?:string
  idHistorial?:string
}


@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private dbService = inject(RxDatabaseService)
  private pacienteService = inject(PacienteService)
  private citaService = inject(CitaService)

  constructor() { }

  async obtenerHistorialMedico({idPaciente, idHistorial}:HistorialMedicoQueryParams):Promise<HistorialMedicoType | null>
  {
    var historialMedico:HistorialMedicoType | null = null
    var citas:Array<CitaType> = []
    var paciente:PacienteType | undefined = undefined

    if(!idPaciente && !idHistorial) return historialMedico

    try {
      const rxHistorialMedico:RxHistorialMedicoDocType | null = await this.dbService.db.historialmedico.findOne({
        selector:{
          ...(idPaciente && { idPaciente }),
          ...(idHistorial && { id:idHistorial })
        }
      })
      .exec()
  
      if(!rxHistorialMedico) return historialMedico
  
      if(rxHistorialMedico.idCitasMedicas){
        const citasQuery:CitasQueryParams ={
          idCitas: rxHistorialMedico.idCitasMedicas,
          ordenamiento:'asc',
          limite: 3
        }

        citas = await this.citaService.obtenerCitas(citasQuery)
      }
  
      if(rxHistorialMedico.idPaciente){
        paciente = await this.pacienteService.obtenerPaciente(rxHistorialMedico.idPaciente)
      }
  
      historialMedico = {
        id:rxHistorialMedico.id,
        idPaciente: rxHistorialMedico.idPaciente,
        idCitasMedicas:rxHistorialMedico.idCitasMedicas,
        historialPrescripciones:rxHistorialMedico.historialPrescripciones,
        notasDoctor:rxHistorialMedico.notasDoctor,
        sugerenciasMedicas: rxHistorialMedico.sugerenciasMedicas,
        estadisticaSalud:rxHistorialMedico.estadisticaSalud,
        createdAt:rxHistorialMedico.createdAt,
        updatedAt:rxHistorialMedico.updatedAt,
        paciente,
        citas
      }
    } catch (error) {
      console.log("error",error)
    }


    return historialMedico;
  }
}
