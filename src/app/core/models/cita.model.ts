import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb"


export const CITA_SCHEMA_LITERAL = {
    title:'Schema Cita Medica',
    version:0,
    description:'',
    type:'object',
    primaryKey:'id',
    properties:{
        id:{
            type:'string',
            primary:true
        },
        idPaciente:{
            type:'sring',
            ref:'paciente'
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
            format:'date-time'
        },
        estado:{
            type:'string',
            enum:["programada", "cancelada", "completada", "no_asistida"],

        },
        motivo:{
            type:'string',

        },
        inicio:{
            type:'string',
            format:'date-time'
        },
        fin:{
            type:'string',
            format:'date-time'
        },
        createdAt: {
            type: "string",
            format: "date-time",
          },
        updatedAt: {
        type: "string",
        format: "date-time"
        }
    },
    required:['id','idPaciente','idDoctor','especialidad','fecha'],
    indexes: ["idPaciente", "idDoctor", "fecha"]
}

const schemaTyped = toTypedRxJsonSchema(CITA_SCHEMA_LITERAL)

export type RxCitaType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>

export const CITA_SCHME:RxJsonSchema<RxCitaType> = CITA_SCHEMA_LITERAL