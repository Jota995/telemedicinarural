import { inject, Injectable } from '@angular/core';
import { AgendaType } from '../models/agenda.model';
import { RxDatabaseService } from './database.service';


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

}
