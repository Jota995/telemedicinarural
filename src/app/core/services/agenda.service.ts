import { inject, Injectable } from '@angular/core';
import { AgendaType, RxAgendaDocType } from '../models/agenda.model';
import { RxDatabaseService } from './database.service';
import { ObjectId } from 'bson';


export type AgendaQueryParams = {
  idsAgendas?:Array<string>
}

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private dbService = inject(RxDatabaseService)

  constructor() { }

  async obtenerAgendas({idsAgendas}:AgendaQueryParams):Promise<Array<AgendaType>>{
    const arrayAgenda:Array<AgendaType> = [];

    const rxAgendas = await this.dbService.db.agenda.find({
      selector:{
        ...(idsAgendas && { id: { $in: idsAgendas } })
      }
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

}
