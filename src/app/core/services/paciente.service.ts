import { inject, Injectable } from '@angular/core';
import { RxDatabaseService } from './database.service';
import { PacienteType, RxPacienteDocType } from '../models/paciente.model';

export type PacienteParamsQuery ={
  idPaciente:string
}

@Injectable({
  providedIn:'root'
})
export class PacienteService {
  private dbService = inject(RxDatabaseService)

  constructor() { }

  async obtenerPaciente({idPaciente}:PacienteParamsQuery):Promise<PacienteType | null>{
    const rxPaciente:RxPacienteDocType | null = await this.dbService
      .db
      .paciente
      .findOne({
        selector:{
          id:idPaciente
        }
      })
      .exec()
    
    
    if(!rxPaciente) return null;

    const paciente:PacienteType = {
      ...rxPaciente
    }

    return paciente;
  }
}
