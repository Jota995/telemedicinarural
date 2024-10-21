import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb"

export const DOCTOR_SCHEMA_LITERAL = {
    title:'Schema Doctor',
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
        especialidades:{
            type:'array',
            uniqueItems:true,
            items:{
                type:'string'
            }
        }
        ,
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
}

const schemaTyped = toTypedRxJsonSchema(DOCTOR_SCHEMA_LITERAL);

export type RxDoctorType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const DOCTOR_SCHEMA:RxJsonSchema<RxDoctorType> = DOCTOR_SCHEMA_LITERAL