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


addRxPlugin(RxDBJsonDumpPlugin);
addRxPlugin(RxDBUpdatePlugin);

let initState:null|Promise<any>;
let DB_INSTANCE:any;

async function createDatabase():Promise<any>{
    const database = await createRxDatabase<any>({
        name:'telemedicina-db',
        storage:getRxStorageDexie()
    });

    await database.addCollections({
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
            const newPaciente:RxPacienteDocType = {
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
            const newDoctor:RxDoctorDocType = {
                id:idDoctor,
                nombre:'Pedro Fernandez',
                especialidades:[
                    'neurologia',
                    'cardiologia'
                ],
                agenda: generarFechas('2024-10-27T08:00:00',1),
                createdAt: new Date().toISOString()
            }

            await database.doctor.insert(newDoctor);
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

function generarFechas(dia:string, intervaloHoras:number):Array<{}> {
    // Crear un array para almacenar las fechas generadas
    const fechas = [];
    
    // Convertir el día en un objeto Date (si es que no es un objeto Date)
    const fechaBase = new Date(dia);
  
    // Generar las 6 fechas
    for (let i = 0; i < 6; i++) {
      // Crear una nueva fecha a partir de la fecha base
      const nuevaFecha = new Date(fechaBase);
      
      // Sumar el intervalo de horas para cada iteración
      nuevaFecha.setHours(nuevaFecha.getHours() + (i * intervaloHoras));

      const agenda = {
        fecha:nuevaFecha.toISOString(),
        estado:'disponible'
      }
      
      // Agregar la fecha al array
      fechas.push(agenda);
    }
  
    return fechas;
  }


@Injectable()
export class RxDatabaseService{
    get db():RxTelemedicinaDb{
        return DB_INSTANCE
    }
}

