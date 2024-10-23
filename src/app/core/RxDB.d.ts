import { RxCollection, RxDatabase, RxDocument } from "rxdb";

export type RxHistorialMedicoDocument = RxDocument<RxHistorialMedicoDocumentType,{}>;
export type RxHistorialMedicoCollection = RxCollection<RxHistorialMedicoDocumentType,{},{}>;

export type RxPacienteDocument = RxDocument<RxPacienteDocumentType,{}>;
export type RxPacienteCollecion = RxCollection<RxPacienteDocumentType,{},{}>;

export type RxDoctorDocument = RxDocument<RxDoctorDocumentType,{}>;
export type RxDoctorCollecion = RxCollection<RxDoctorDocumentType,{},{}>;

export type RxCitaDocument = RxDocument<RxCitaDocumentType,{}>;
export type RxCitaCollection = RxCollection<RxCitaDocumentType,{},{}>;

export type RxHistorialMedicoCollections = {
    historialmedico: RxHistorialMedicoCollection,
    paciente:RxPacienteCollecion,
    doctor:RxDoctorCollecion,
    cita:RxCitaCollection
};

export type RxTelemedicinaDb = RxDatabase<RxHistorialMedicoCollections>