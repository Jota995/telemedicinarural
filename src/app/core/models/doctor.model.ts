import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb"
import { AgendaType } from "./agenda.model";

export const DOCTOR_SCHEMA_LITERAL = {
    title:'Schema Doctor',
    version:0,
    description:'',
    type:'object',
    primaryKey:'id',
    properties:{
        id:{
            type:'string',
            maxLength: 100,
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
        IdsAgenda:{
            type: "array",
            ref:"agenda",
            items:{
                type:"string"
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
    required:['id']
} as const;

const schemaTyped = toTypedRxJsonSchema(DOCTOR_SCHEMA_LITERAL);

export type RxDoctorDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const doctorSchema:RxJsonSchema<RxDoctorDocType> = DOCTOR_SCHEMA_LITERAL

export type DoctorType = RxDoctorDocType & {
    agenda?:Array<AgendaType> | undefined
}