import { inject, Injectable } from '@angular/core';
import { RxDatabaseService } from './database.service';
import { Observable } from 'rxjs';
import { DoctorType, RxDoctorDocType } from '../models/doctor.model';
import { CitaType } from '../models/cita.model';

export type DoctorParamsQuery = {
  especialidad?: string | null
}

@Injectable({
  providedIn:'root'
})
export class DoctorService {
  private dbService = inject(RxDatabaseService)

  constructor() { }

  async obtenerDoctor(idDoctor:string):Promise<DoctorType | null>{
    const rxDoctor:RxDoctorDocType | null = await this.dbService.db.doctor.findOne({
      selector:{
        id: idDoctor
      }
    }).exec()

    if(!rxDoctor) return null

    const doctor:DoctorType = {
      id:rxDoctor.id,
      nombre:rxDoctor.nombre,
      fechaNacimiento:rxDoctor.fechaNacimiento,
      genero: rxDoctor.genero,
      estadoCivil: rxDoctor.estadoCivil,
      nacionalidad:rxDoctor.nacionalidad,
      especialidades: rxDoctor.especialidades,
      agenda:rxDoctor.agenda,
      createdAt:rxDoctor.createdAt,
      updatedAt: rxDoctor.updatedAt
    }

    return doctor
  }

  async obtenerDoctores({especialidad}:DoctorParamsQuery):Promise<Array<DoctorType> | undefined>{
    const doctores:Array<DoctorType> = []

    const rxDoctores:Array<RxDoctorDocType> | null = await this.dbService.db.doctor.find({
      selector:{
        especialidades:{
          $elemMatch: {
            $eq: especialidad
          }
        },

      }
    }).exec()

    if(!rxDoctores || !rxDoctores.length) return undefined

    for(const rxDoctor of rxDoctores){
      const doctor:DoctorType = {
        id:rxDoctor.id,
        nombre:rxDoctor.nombre,
        fechaNacimiento:rxDoctor.fechaNacimiento,
        genero: rxDoctor.genero,
        estadoCivil: rxDoctor.estadoCivil,
        nacionalidad:rxDoctor.nacionalidad,
        especialidades: rxDoctor.especialidades,
        agenda:rxDoctor.agenda,
        createdAt:rxDoctor.createdAt,
        updatedAt: rxDoctor.updatedAt
      }

      doctores.push(doctor)
    }

    console.log("doctores",doctores)

    return doctores
  }

  async marcarAgenda(cita:CitaType):Promise<void>{
    const doctor = await this.obtenerDoctor(cita.idDoctor)

    if(!doctor?.agenda) return

    const agendaActualizada = doctor.agenda.map((old:any) => {
      if (old.fecha === cita.fecha) {
        return { ...old, estado: 'pendiente' }; // Actualiza el estado de la cita
      }
      return old; // No modificar otras citas
    });

    await this.dbService.db.doctor.findOne({
      selector:{
        id: cita.idDoctor
      }
    })
    .update({
      $set: {
        agenda: agendaActualizada
      }
    });
  }
}
