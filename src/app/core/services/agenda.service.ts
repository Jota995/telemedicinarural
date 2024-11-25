import { inject, Injectable } from '@angular/core';
import { AgendaType, RxAgendaDocType } from '../models/agenda.model';
import { RxDatabaseService } from './database.service';
import { ObjectId } from 'bson';


export type AgendaQueryParams = {
  idDoctor?:string
  idsAgendas?:Array<string>
  estado?:"disponible"| "cancelada"| "completada"| "no_asistida"| "pendiente"
  especialidad?:string
  fechaDesde?:Date,
  fechaHasta?:Date
}

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private dbService = inject(RxDatabaseService)

  constructor() { }

  async obtenerAgendas({idsAgendas, idDoctor,estado,especialidad,fechaDesde,fechaHasta}:AgendaQueryParams):Promise<Array<AgendaType>>{
    console.log("query \n",idsAgendas, idDoctor,estado,especialidad,fechaDesde,fechaHasta)
    const arrayAgenda:Array<AgendaType> = [];

    const selector:any = {
      ...(idsAgendas && { id: { $in: idsAgendas } }),
      ...(idDoctor && {idDoctor}),
      ...(estado && {estado}),
      ...(especialidad && {especialidad})
    }

    if (fechaDesde && fechaHasta) {
      selector.fecha = {
        $gte: fechaDesde,
        $lte: fechaHasta
      };
    }


    const rxAgendas = await this.dbService.db.agenda.find({
      selector
    })
    .exec();

    if(!rxAgendas || !rxAgendas.length) return arrayAgenda;

    for(const rxAgenda of  rxAgendas){
      const agenda:AgendaType = {
        id:rxAgenda.id,
        idDoctor: rxAgenda.idDoctor,
        especialidad: rxAgenda.especialidad,
        fecha: rxAgenda.fecha,
        estado: rxAgenda.estado,
        createdAt: rxAgenda.createdAt,
        updatedAt: rxAgenda.updatedAt
      };

      arrayAgenda.push(agenda);
    }

    return arrayAgenda;

  }

  async guardarAgenda(agenda:AgendaType){

    const objectId = new ObjectId().toHexString()
    const rxAgenda:RxAgendaDocType = {
      id:objectId,
      idDoctor:agenda.idDoctor,
      especialidad:agenda.especialidad,
      fecha:agenda.fecha,
      estado:agenda.estado,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await this.dbService.db.agenda.insert(rxAgenda);
  }

  async actualizarAgenda(agenda:AgendaType){
    await this.dbService.db.agenda.findOne({
      selector:{
        id: agenda?.id
      }
    })
    .update({
      $set: {
        especialidad: agenda.especialidad,
        fecha:agenda.fecha,
        estado: agenda.estado,
        updatedAt: new Date().toISOString()
      }
    });
  }

}
