import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb";
import { DoctorType } from "./doctor.model";


export const AGENDA_SCHEMA_LITERAL = {
    title:'Schema agenda doctor',
    version:0,
    description:'',
    type:'object',
    primaryKey:'id',
    properties:{
        id:{
            type:'string',
            maxLength: 100,
        },
        idDoctor:{
            type:'string',
            ref:'doctor'
        },
        especialidad:{
            type:'string'
        },
        fecha:{
            type:'string',
            format:'date-time',
            maxLength: 100,
        },
        estado:{
            type:'string',
            enum:["disponible", "cancelada", "completada", "no_asistida","pendiente"],

        },
        createdAt: {
            type: "string",
            format: "date-time",
          },
        updatedAt: {
            type: "string",
            format: "date-time"
        }
    }
} as const;

const schemaTyped = toTypedRxJsonSchema(AGENDA_SCHEMA_LITERAL)

export type RxAgendaDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>

export const agendaSchema:RxJsonSchema<RxAgendaDocType> = AGENDA_SCHEMA_LITERAL

export type AgendaType = RxAgendaDocType & {
    doctor?: DoctorType | undefined
}

