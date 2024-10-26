import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb"

export const DOCTOR_SCHEMA_LITERAL = {
    title:'Schema Doctor',
    version:0,
    description:'',
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
        },
        agenda:{
            type:'array',
            items:{
                type:'object',
                properties:{
                    fecha:{
                        type:'string',
                        format:'date-time'
                    },
                    estado:{
                        type:'string',
                        enum:['disponible','agendada','cancelada','pendiente']
                    }
                }
            }
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

const schemaTyped = toTypedRxJsonSchema(DOCTOR_SCHEMA_LITERAL);

export type RxDoctorDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const doctorSchema:RxJsonSchema<RxDoctorDocType> = DOCTOR_SCHEMA_LITERAL

export type DoctorType = RxDoctorDocType & {
    
}