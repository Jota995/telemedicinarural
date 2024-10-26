import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb"

export const PACIENTE_SCHEMA_LITERAL = {
    title:'Schema Paciente',
    version:0,
    descriptioin:'',
    type:'object',
    primaryKey:'id',
    properties:{
        id:{
            type:'string',
            primary: true
        },
        nombre:{
            type:'string'
        },
        fechaNacimiento:{
            type:'string',
            format:'date-time'
        },
        genero:{
            type:'string'
        },
        estadoCivil:{
            type:'string'
        },
        nacionalidad:{
            type:'string'
        },
        createdAt:{
            type:'string',
            format:'date-time'
        },
        updatedAt:{
            type:'string',
            format:'date-time'
        }
    },
    required:['id','nombre'],
    indexes:['id']
} as const;

const schemaTyped = toTypedRxJsonSchema(PACIENTE_SCHEMA_LITERAL);

export type RxPacienteDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const pacienteSchema:RxJsonSchema<RxPacienteDocType> = PACIENTE_SCHEMA_LITERAL

export type PacienteType = RxPacienteDocType & {
    
}