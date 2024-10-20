import { RxCollection, RxDatabase, RxDocument } from "rxdb";

export type RxHistorialMedicoDocument = RxDocument<RxHistorialMedicoDocumentType,{}>;
export type RxHistorialMedicoCollection = RxCollection<RxHistorialMedicoDocumentType,{},{}>;
export type RxHistorialMedicoCollections = {historialMedico: RxHistorialMedicoCollection};
export type RxTelemedicinaDb = RxDatabase<RxHistorialMedicoCollections>