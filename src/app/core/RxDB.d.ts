import { RxCollection, RxDatabase, RxDocument } from "rxdb";

import {RxHistorialMedicoDocType} from './models/historialmedico.model'
import {RxPacienteDocType} from './models/paciente.model'
import {RxDoctorType} from './models/doctor.model'
import {RxCitaDocType} from './models/cita.model'
import {RxAgendaDocType} from './models/agenda.model'

export type RxHistorialMedicoDocument = RxDocument<RxHistorialMedicoDocType,{}>;
export type RxHistorialMedicoCollection = RxCollection<RxHistorialMedicoDocType,{},{}>;

export type RxPacienteDocument = RxDocument<RxPacienteDocType,{}>;
export type RxPacienteCollecion = RxCollection<RxPacienteDocType,{},{}>;

export type RxDoctorDocument = RxDocument<RxDoctorType,{}>;
export type RxDoctorCollecion = RxCollection<RxDoctorType,{},{}>;

export type RxCitaDocument = RxDocument<RxCitaDocType,{}>;
export type RxCitaCollection = RxCollection<RxCitaDocType,{},{}>;

export type RxAgendaDocument = RxDocument<RxAgendaDocType,{}>;
export type RxAgendaCollection = RxCollection<RxAgendaDocType,{},{}>;

export type RxHistorialMedicoCollections = {
    historialmedico: RxHistorialMedicoCollection,
    paciente:RxPacienteCollecion,
    doctor:RxDoctorCollecion,
    cita:RxCitaCollection,
    agenda:RxAgendaCollection
};

export type RxTelemedicinaDb = RxDatabase<RxHistorialMedicoCollections>