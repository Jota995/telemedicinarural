import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { HISTORIALMEDICO_SCHEMA } from '../models/historialmedico.model';
import { Injectable } from '@angular/core';
import { RxTelemedicinaDb } from '../RxDB';
import {RxDBJsonDumpPlugin} from 'rxdb/plugins/json-dump'
import { PACIENTE_SCHEMA } from '../models/paciente.model';
import { DOCTOR_SCHEMA } from '../models/doctor.model';
import { CITA_SCHME } from '../models/cita.model';

addRxPlugin(RxDBJsonDumpPlugin);
let initState:null|Promise<any>;
let DB_INSTANCE:any;

async function createDatabase():Promise<any>{
    const database = await createRxDatabase<any>({
        name:'telemedicina-db',
        storage:getRxStorageDexie()
    });

    await database.addCollections({
        historialmedico:{
            schema: HISTORIALMEDICO_SCHEMA
        },
        paciente:{
            schema: PACIENTE_SCHEMA
        },
        doctor:{
            schema: DOCTOR_SCHEMA
        },
        cita:{
            schema:CITA_SCHME
        }
    })

    await seedDb(database);

    return database;
}

async function seedDb(database:RxTelemedicinaDb){
    try {
        const idPaciente = 'd17b8f2a-6f01-4f57-853f-d5dee34960e0'
        const idDoctor = 'e5c0e948-954d-499f-97e2-40092393cf27'
        const idHistorialMedico = '4f32e1f6-f67f-4e90-a2b4-20fc3ad5a6ee'

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
            const newPaciente = {
                id:idPaciente,
                nombre:'Hector Morales',
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
            const newDoctor = {
                id:idDoctor,
                nombre:'Pedro Fernandez',
                especialidades:[
                    'neurologia',
                    'cardiologia'
                ],
                createdAt: new Date().toISOString()
            }

            await database.doctor.insert(newDoctor);
            console.log("doctor insertado correctamente");
        }

        if(!existeHistorialMedicoPaciente){
            const newHistorialMedico = {
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
                consultasMedicas:[
                    {
                        idDoctor:idDoctor,
                        fecha: new Date().toISOString()
                    },
                    {
                        idDoctor:idDoctor,
                        fecha: new Date().toISOString()
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
    if(!initState){
        initState = createDatabase().then((db) => (DB_INSTANCE = db))
    }

    await initState;
}


@Injectable()
export class RxDatabaseService{
    get db():RxTelemedicinaDb{
        return DB_INSTANCE
    }
}

