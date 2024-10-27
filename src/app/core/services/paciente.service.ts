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

  async obtenerPaciente(idPaciente:string):Promise<PacienteType | undefined>{
    const rxPaciente:RxPacienteDocType | null = await this.dbService
      .db
      .paciente
      .findOne({
        selector:{
          id:idPaciente
        }
      })
      .exec()
    
    
    if(!rxPaciente) return undefined;

    const paciente:PacienteType = {
      id:rxPaciente.id,
      nombre: rxPaciente.nombre,
      fechaNacimiento: rxPaciente.fechaNacimiento,
      genero: rxPaciente.genero,
      estadoCivil: rxPaciente.estadoCivil,
      nacionalidad: rxPaciente.nacionalidad,
      createdAt: rxPaciente.createdAt,
      updatedAt: rxPaciente.updatedAt
    }

    return paciente;
  }
}
