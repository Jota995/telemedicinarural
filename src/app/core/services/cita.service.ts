import { inject, Injectable } from '@angular/core';
import { RxDatabaseService } from './database.service';
import { DoctorParamsQuery, DoctorService } from './doctor.service';
import { PacienteParamsQuery, PacienteService } from './paciente.service';
import { CitaType, RxCitaDocType } from '../models/cita.model';
import { DoctorType } from '../models/doctor.model';
import { PacienteType } from '../models/paciente.model';

export type CitasQueryParams = {
  idCitas?:Array<string>
  fechaInicio?: Date
  fechaTermino?: Date
  idPaciente?:string
  idDoctor?:string
  estado?:"programada"|"cancelada"|"completada"|"no_asistida"|"pendiente"
  limite?:number,
  ordenamiento?:'asc'|'desc'
}

@Injectable(
  {
    providedIn:'root'
  }
)
export class CitaService {
  private dbService = inject(RxDatabaseService)
  private doctorService = inject(DoctorService)
  private pacienteService = inject(PacienteService)
  
  constructor() { }


  async obtenerCita(idCita:string):Promise<CitaType | null>{
    var cita:CitaType|null = null;

    const rxCita : RxCitaDocType | null = await this.dbService.db.cita.findOne({
      selector:{
        id:idCita
      },
      sort:[{
        fecha:'asc'
      }]
    })
    .exec()

    if(!rxCita) return cita

    const doctor:DoctorType | undefined = await this.doctorService.obtenerDoctor(rxCita.idDoctor)
    const paciente:PacienteType | undefined = await this.pacienteService.obtenerPaciente(rxCita.idPaciente)

    cita = {
      id:rxCita.id,
      idPaciente:rxCita.idPaciente,
      idDoctor:rxCita.idDoctor,
      especialidad:rxCita.especialidad,
      fecha:rxCita.fecha,
      estado:rxCita.estado,
      motivo:rxCita.motivo,
      inicio:rxCita.inicio,
      fin:rxCita.fin,
      createdAt:rxCita.createdAt,
      updatedAt:rxCita.updatedAt,
      doctor,
      paciente,
    }

    return cita;
  }

  async obtenerCitas({fechaInicio, fechaTermino, idPaciente,idDoctor,estado,idCitas,limite,ordenamiento= 'asc'}:CitasQueryParams):Promise<Array<CitaType>>{
    const citas:Array<CitaType> = []

    const selector: any = {
      ...(estado && { estado }),
      ...(idPaciente && { idPaciente }),
      ...(idDoctor && { idDoctor }),
      ...(idCitas && { id: { $in: idCitas } })
    };

    if (fechaInicio && fechaTermino) {
      selector.fecha = {
        $gte: fechaInicio.toISOString(),
        $lte: fechaTermino.toISOString()
      };
    }
  
    const rxCitas : Array<RxCitaDocType> | null = await this.dbService.db.cita.find({
      selector,
      sort:[{
        fecha:ordenamiento
      }],
      ...(limite && { limit:limite })
    })
    .exec()

    console.log("rxcitas ",rxCitas)

    if(!rxCitas || !rxCitas.length) return citas

    for(const rxCita of rxCitas){
      const pacienteQuery:PacienteParamsQuery = {
       idPaciente: rxCita.idPaciente 
      }

      const doctor:DoctorType | undefined = await this.doctorService.obtenerDoctor(rxCita.idDoctor)
      const paciente:PacienteType | undefined = await this.pacienteService.obtenerPaciente(rxCita.idPaciente)

      const cita:CitaType = {
        id:rxCita.id,
        idPaciente:rxCita.idPaciente,
        idDoctor:rxCita.idDoctor,
        especialidad:rxCita.especialidad,
        fecha:rxCita.fecha,
        estado:rxCita.estado,
        motivo:rxCita.motivo,
        inicio:rxCita.inicio,
        fin:rxCita.fin,
        createdAt:rxCita.createdAt,
        updatedAt:rxCita.updatedAt,
        doctor,
        paciente
      }

      citas.push(cita)
    }

    return citas
  }

  async agendarCita(cita:CitaType):Promise<void>{
    const rxCita:RxCitaDocType= {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      idPaciente: cita.idPaciente,
      idDoctor:cita.idDoctor,
      especialidad: cita.especialidad,
      fecha: cita.fecha,
      estado:cita.estado,
      motivo:cita.motivo,
      createdAt:new Date().toISOString()
    }

    await this.dbService.db.cita.insert(rxCita)

    await this.doctorService.marcarAgenda(cita);
  }

  async citasDelMes():Promise<number>{
    const fechaActual = new Date();
  
    // Obtener el primer día del mes
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    
    // Obtener el último día del mes
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);

    const citasDelMes = await this.dbService
      .db
      .cita
      .count({
        selector:{
          fecha:{
            $gte: primerDiaMes.toISOString(),
            $lte: ultimoDiaMes.toISOString() 
          }
        }
      })
      .exec()

    return citasDelMes || 0;
  }
}
