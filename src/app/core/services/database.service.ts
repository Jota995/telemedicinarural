import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { historialMedicoSchema } from '../models/historialmedico.model';
import { Injectable } from '@angular/core';
import { RxTelemedicinaDb } from '../RxDB';
import { pacienteSchema } from '../models/paciente.model';
import { doctorSchema } from '../models/doctor.model';
import { citaSchema } from '../models/cita.model';
import {RxDBJsonDumpPlugin} from 'rxdb/plugins/json-dump'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { isDevMode } from '@angular/core';
import {environment} from '../../../environments/environment'
import { removeRxDatabase } from 'rxdb';

import { replicateRxCollection } from 'rxdb/plugins/replication';
import { agendaSchema, RxAgendaDocType } from '../models/agenda.model';


addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBUpdatePlugin);

let initState:null|Promise<any>;
let DB_INSTANCE:any;

async function createDatabase():Promise<any>{
    try {
        const database = await createRxDatabase<RxTelemedicinaDb>({
            name:'telemedicina-db',
            storage:getRxStorageDexie(),
            //TODO: DESABILITAR Y ARREGLAR
            allowSlowCount:true
        });
    
        const collections = await database.addCollections({
            historialmedico:{
                schema: historialMedicoSchema
            },
            paciente:{
                schema: pacienteSchema
            },
            doctor:{
                schema: doctorSchema
            },
            cita:{
                schema:citaSchema
            },
            agenda:{
                schema:agendaSchema
            }
        })
    
        const replicationStateDoctores = await replicateRxCollection({
            replicationIdentifier:'https://localhost:7252/api/doctor',
            collection: collections.doctor,
            retryTime:12000,
            pull:{
                async handler(checkpointOrNull, batchSize){
                    console.log("pull replication doctores s")
                    const updatedAt:string|null = checkpointOrNull ? (checkpointOrNull as { updatedAt: string }).updatedAt : null;
    
                    const baseUrl = `${environment.apiBaseUrl}/api/doctor/pulldata`;
    
                    const queryParams = new URLSearchParams();
    
                    if (updatedAt !== null) {
                        queryParams.append("UpdatedAt", updatedAt);
                    }
    
                    queryParams.append("limit", String(batchSize));
    
                    const response = await fetch(`${baseUrl}?${queryParams.toString()}`)
                    const data = await response.json()
    
                    return {
                        documents:  data.documents,
                        checkpoint: {updatedAt:data.checkpoint}
                    }
                }
            },
        });
    
        
    
        const replicationStateCitas = await replicateRxCollection(
            {
                replicationIdentifier:'https://localhost:7252/api/cita',
                collection:collections.cita,
                retryTime:5000,
                pull:{
                    async handler(checkpointOrNull, batchSize){
    
                        const updatedAt:string|null = checkpointOrNull ? (checkpointOrNull as { updatedAt: string }).updatedAt : null;
    
                        const baseUrl = `${environment.apiBaseUrl}/api/cita/pulldata`;
    
                        const queryParams = new URLSearchParams();
    
                        if (updatedAt !== null) {
                            queryParams.append("updatedAt", updatedAt);
                        }
    
                        queryParams.append("limit", String(batchSize));
    
                        const response = await fetch(`${baseUrl}?${queryParams.toString()}`)
    
                        const data = await response.json()
    
                        return {
                            documents:  data.documents,
                            checkpoint: {updatedAt:data.checkpoint}
                        }
                    }
                },
                push:{
                    async handler(changeRows){
                        const citasReplication = changeRows.map(x=> x.newDocumentState)
                        const rawResponse = await fetch(`${environment.apiBaseUrl}/api/cita/push`, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(citasReplication)
                        });
                        const conflicts = await rawResponse.json();
                        return conflicts
                    }
                }
            }
        )
    
        
        const replicationStateAgendaMedica = await replicateRxCollection(
            {
                replicationIdentifier:'https://localhost:7252/api/agenda',
                collection:collections.agenda,
                retryTime:50000,
                pull:{
                    async handler(checkpointOrNull, batchSize){
                        const baseUrl = `${environment.apiBaseUrl}/api/agenda/pulldata`;
    
                        const updatedAt:string|null = checkpointOrNull ? (checkpointOrNull as { updatedAt: string }).updatedAt : null;
                        const queryParams = new URLSearchParams();
    
                        if (updatedAt !== null) {
                            queryParams.append("UpdatedAt", updatedAt);
                        }
    
                        queryParams.append("Limit", String(batchSize));
                        queryParams.append("Estado", "disponible");
    
                        const response = await fetch(`${baseUrl}?${queryParams.toString()}`)
                        const data = await response.json()
                        console.log("response data agenda", data)
                        return {
                            documents:  data.documents,
                            checkpoint: {updatedAt:data.checkpoint}
                        }
                    }
                },
                push:{
                    async handler(changeRows){
                        const agendaMedicaReplication = changeRows.map(x=> x.newDocumentState)
    
                        const rawResponse = await fetch(`${environment.apiBaseUrl}/api/agenda/pushdata`, {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(agendaMedicaReplication)
                        });
                        const conflicts = await rawResponse.json();
    
                        console.log("conflicts", conflicts)
    
                        return conflicts
                    }
                }
            }
        )
        
        // replicationStateDoctores.error$.subscribe(erro =>{
        //     console.log("error replication doctor",erro)
        // })
    
        // replicationStateAgendaMedica.error$.subscribe(error =>{
        //     console.log("ocurrio un error en agenda replication\n",error)
        // })

        // replicationStateCitas.error$.subscribe(error =>{
        //     console.log("ocurrio un error cita medica",error)
        // })
    
    
        return database;
    } catch (error) {
        console.log("error al iniciar db", error)
    }
}


export async function initDatabase() {

    if (isDevMode()){
        await import('rxdb/plugins/dev-mode').then(
            module => addRxPlugin(module.RxDBDevModePlugin)
        );
    }
    if(!initState){
        console.log("iniciando estado db")
        initState = createDatabase().then((db) => (DB_INSTANCE = db))
    }

    await initState;
}


@Injectable(
    {
        providedIn:'root'
    }
)
export class RxDatabaseService{
    get db():RxTelemedicinaDb{
        return DB_INSTANCE
    }
}

