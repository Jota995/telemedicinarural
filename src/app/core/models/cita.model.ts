import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb"
import { DoctorType } from "./doctor.model";
import { PacienteType } from "./paciente.model";

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
            type:'string',
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
            enum:["programada", "cancelada", "completada", "no_asistida","pendiente"],

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
    indexes: ["idPaciente", "idDoctor", "fecha"],
} as const;

const schemaTyped = toTypedRxJsonSchema(CITA_SCHEMA_LITERAL)

export type RxCitaDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>

export const citaSchema:RxJsonSchema<RxCitaDocType> = CITA_SCHEMA_LITERAL

export type CitaType = RxCitaDocType & {
    doctor: DoctorType | null
    paciente: PacienteType | null

}