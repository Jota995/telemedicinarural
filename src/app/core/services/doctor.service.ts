import { inject, Injectable } from '@angular/core';
import { RxDatabaseService } from './database.service';
import { Observable } from 'rxjs';
import { DoctorType, RxDoctorDocType } from '../models/doctor.model';
import { CitaType } from '../models/cita.model';
import { AgendaService } from './agenda.service';

export type DoctorParamsQuery = {
  especialidad?: string | null
}

@Injectable({
  providedIn:'root'
})
export class DoctorService {
  private dbService = inject(RxDatabaseService)
  private agendaService = inject(AgendaService)

  constructor() { }

  async obtenerDoctor(idDoctor:string):Promise<DoctorType | undefined>{
    const rxDoctor:RxDoctorDocType | null = await this.dbService.db.doctor.findOne({
      selector:{
        id: idDoctor
      }
    }).exec()

    if(!rxDoctor) return undefined

    console.log("Rx doctor",rxDoctor)

    const doctor:DoctorType = {
      id:rxDoctor.id,
      nombre:rxDoctor.nombre,
      fechaNacimiento:rxDoctor.fechaNacimiento,
      genero: rxDoctor.genero,
      estadoCivil: rxDoctor.estadoCivil,
      nacionalidad:rxDoctor.nacionalidad,
      especialidades: rxDoctor.especialidades,
      idsAgenda:rxDoctor.idsAgenda,
      createdAt:rxDoctor.createdAt,
      updatedAt: rxDoctor.updatedAt
    }

    console.log("obtener doctor",doctor)

    if(doctor.idsAgenda && doctor.idsAgenda.length > 0){
      doctor.agenda = await this.agendaService.obtenerAgendas({idsAgendas:doctor.idsAgenda})
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
        idsAgenda:rxDoctor.idsAgenda,
        createdAt:rxDoctor.createdAt,
        updatedAt: rxDoctor.updatedAt
      }

      if(doctor.idsAgenda && doctor.idsAgenda.length > 0){
        doctor.agenda = await this.agendaService.obtenerAgendas({idsAgendas:doctor.idsAgenda})
      }

      doctores.push(doctor)
    }

    return doctores
  }

  async marcarAgenda(cita:CitaType):Promise<void>{
    const doctor = await this.obtenerDoctor(cita.idDoctor)

    if(!doctor?.agenda) return

    const agenda = doctor.agenda.find(x => x.fecha == cita.fecha.toString())

    await this.dbService.db.agenda.findOne({
      selector:{
        id: agenda?.id
      }
    })
    .update({
      $set: {
        estado:'pendiente'
      }
    });
  }
}
