import { addRxPlugin, createRxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { HISTORIALMEDICO_SCHEMA } from '../models/historialmedico.model';
import { Injectable } from '@angular/core';
import { RxTelemedicinaDb } from '../RxDB';
import {RxDBJsonDumpPlugin} from 'rxdb/plugins/json-dump'

addRxPlugin(RxDBJsonDumpPlugin);

async function createDatabase():Promise<any>{
    const database = await createRxDatabase<any>({
        name:'telemedicina-db',
        storage:getRxStorageDexie()
    });

    await database.addCollections({
        historialmedico:{
            schema: HISTORIALMEDICO_SCHEMA
        }
    })

    const collection = database.historialmedico;

    collection.exportJSON().then((json:any) => console.table(json));

    return database;
}

let initState:null|Promise<any>;
let DB_INSTANCE:any;

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

