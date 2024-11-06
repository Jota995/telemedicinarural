import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { historialMedicoSchema, RxHistorialMedicoDocType } from '../models/historialmedico.model';
import { Injectable } from '@angular/core';
import { RxTelemedicinaDb } from '../RxDB';
import { pacienteSchema, RxPacienteDocType } from '../models/paciente.model';
import { doctorSchema, RxDoctorDocType } from '../models/doctor.model';
import { citaSchema } from '../models/cita.model';
import {RxDBJsonDumpPlugin} from 'rxdb/plugins/json-dump'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { isDevMode } from '@angular/core';
import {environment} from '../../../environments/environment'

import { replicateRxCollection } from 'rxdb/plugins/replication';
import { agendaSchema, RxAgendaDocType } from '../models/agenda.model';


addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBUpdatePlugin);

let initState:null|Promise<any>;
let DB_INSTANCE:any;

async function createDatabase():Promise<any>{
    const database = await createRxDatabase<RxTelemedicinaDb>({
        name:'telemedicina-db',
        storage:getRxStorageDexie()
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

    const replicationState = await replicateRxCollection({
        replicationIdentifier:'https://localhost:7252/api/appointment',
        collection:collections.cita,
        retryTime:12000,
        // pull:{
        //     async handler(checkpointOrNull, batchSize){
        //         const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : 0;
        //         const id = checkpointOrNull ? checkpointOrNull.id : '';
        //         const response = await fetch(`${environment.apiBaseUrl}/pull?updatedAt=${updatedAt}&limit=${batchSize}`)
        //         const data = await response.json()
        //         return {
        //             documents:  data.documents,
        //             checkpoint: data.checkpoint
        //         }
        //     }
        // },
        push:{
            async handler(changeRows){
                console.log("change rosw first",changeRows)
                const citasReplication = changeRows.map(x=> x.newDocumentState)
                console.log("change rows",citasReplication)


                const rawResponse = await fetch(`${environment.apiBaseUrl}/api/appointment/push`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(citasReplication)
                });
                const conflicts = await rawResponse.json();

                console.log("conflicts", conflicts)

                return conflicts
            }
        }
    })

    replicationState.error$.subscribe(error =>{
        console.log("ocurrio un error",error)
    })

    // replicationState.received$.subscribe((doc) => {
    //     console.log("recividos ", doc)
    // });

    // replicationState.sent$.subscribe(doc => console.log("enviados",doc));

    await seedDb(database);

    return database;
}

async function seedDb(database:RxTelemedicinaDb){
    try {
        const idPaciente = '6726902521d29ac63160a06e'
        const idDoctor = '6726d7fbff280067c1de9582'
        const idHistorialMedico = '6726903ff2f5e67b572472a0'

        const existePaciente = await database.paciente.findOne({
            selector:{
                id:idPaciente
            }
        }).exec();

        const existeDoctor = await database.doctor.findOne({
            selector:{
                id:idDoctor
            }
        }).exec();

        const existeHistorialMedicoPaciente = await database.historialmedico.findOne({
            selector:{
                id:idHistorialMedico
            }
        }).exec();
    
        if(!existePaciente){
            const newPaciente:RxPacienteDocType = {
                id:idPaciente,
                nombre:'Jose Molina',
                fechaNacimiento:new Date().toISOString(),
                genero:'masculino',
                estadoCivil:'soltero',
                nacionalidad:'chileno',
                createdAt: new Date().toISOString()
            }
    
            await database.paciente.insert(newPaciente);
            console.log("paciente insertado correctamente");
        }

        if(!existeDoctor){
            
            const agenda:Array<RxAgendaDocType> = [
                {
                    id:'672a8fd958db34bbe288b30d',
                    idDoctor:idDoctor,
                    especialidad:'neurologia',
                    fecha: new Date(2024,10,9,11).toISOString(),
                    estado:'disponible',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id:'672a8fe90b6aa5eb4cc39257',
                    idDoctor:idDoctor,
                    especialidad:'neurologia',
                    fecha: new Date(2024,10,9,13).toISOString(),
                    estado:'disponible',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id:'672a8ff60c75e773dc2167d4',
                    idDoctor:idDoctor,
                    especialidad:'neurologia',
                    fecha: new Date(2024,10,22,11).toISOString(),
                    estado:'disponible',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id:'672a8ff60c75e773dc2167d4',
                    idDoctor:idDoctor,
                    especialidad:'neurologia',
                    fecha: new Date(2024,10,22,9).toISOString(),
                    estado:'disponible',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }
            ]

            const newDoctor:RxDoctorDocType = {
                id:idDoctor,
                nombre:'Pedro Fernandez',
                especialidades:[
                    'neurologia',
                    'cardiologia'
                ],
                IdsAgenda: agenda.map(x => x.id).filter((id): id is string => id !== undefined),
                createdAt: new Date().toISOString()
            }

            await database.doctor.insert(newDoctor);


            await database.agenda.bulkInsert(agenda)


            console.log("doctor insertado correctamente");
        }

        if(!existeHistorialMedicoPaciente){
            const newHistorialMedico:RxHistorialMedicoDocType = {
                id: idHistorialMedico,
                idPaciente: idPaciente,
                historialPrescripciones:[
                    {
                        name:'Medicina A',
                        dosis:'500mg'
                    }
                ],
                notasDoctor:[
                    {
                        idDoctor:idDoctor,
                        nota:'El paciente responde bien a la medicacion.'
                    }
                ],
                sugerenciasMedicas:[
                    {
                        name:'Dieta saludable',
                        sugerencia:'Mantener una dieta balanceada rica en frutas y vegetales'
                    }
                ],
                estadisticaSalud:[
                    {
                        name:'Presion arterial',
                        estadistica:'120/80'
                    }
                ],
                createdAt: new Date().toISOString()
            }
            await database.historialmedico.insert(newHistorialMedico)
            console.log("historial medico insertado correctamente")
        }

    } catch (error) {
        console.log("error en semilla database ", error)
    }
}

export async function initDatabase() {

    if (isDevMode()){
        await import('rxdb/plugins/dev-mode').then(
            module => addRxPlugin(module.RxDBDevModePlugin)
        );
    }
    if(!initState){
        initState = createDatabase().then((db) => (DB_INSTANCE = db))
    }

    await initState;
}

function generarFechas(diasArray:Array<string>, intervaloHoras:number) {
    // Crear un array para almacenar todas las fechas generadas
    const todasLasFechas:Array<any> = [];
    
    // Iterar sobre cada día del array de días
    diasArray.forEach(dia => {
        // Convertir el día en un objeto Date
        const fechaBase = new Date(dia);

        // Crear las 6 fechas para el día actual
        for (let i = 0; i < 6; i++) {
            // Crear una nueva fecha a partir de la fecha base
            const nuevaFecha = new Date(fechaBase);
            
            // Sumar el intervalo de horas para cada iteración
            nuevaFecha.setHours(nuevaFecha.getHours() + (i * intervaloHoras));

            const agenda = {
                fecha: nuevaFecha.toISOString(),
                estado: 'disponible'
            };

            // Agregar la fecha generada al array de todas las fechas
            todasLasFechas.push(agenda);
        }
    });

    return todasLasFechas;
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

