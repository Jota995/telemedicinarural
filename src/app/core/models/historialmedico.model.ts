import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb";
import { PacienteType, RxPacienteDocType } from "./paciente.model";
import { CitaType, RxCitaDocType } from "./cita.model";

export const HISTORIALMEDICO_SCHEMA_LITERAL = {
    title: "Medical History Schema",
    version: 0,
    description: "Historial médico de un paciente para una aplicación de telemedicina",
    type: "object",
    primaryKey: "id",
    properties: {
      id: {
        type: "string",
        primary: true, // Clave primaria única para cada registro de historial médico
      },
      idPaciente: {
        type: "string", // Identificador del paciente al que pertenece este historial
        ref: "paciente", // Referencia a la colección de pacientes (si la hay)
      },
      citasMedicas: {
        type: "array", // Registro de consultas médicas recientes
        items: {
          type: "string",
          ref:'cita'
        },
      },
      historialPrescripciones: {
        type: "array", // Lista de condiciones médicas preexistentes
        items: {
          type: "object",
          properties: {
            name: { type: "string" }, 
            dosis: { type: "string" }, 
          },
        },
      },
      notasDoctor: {
        type: "array", 
        items: {
          type: "object",
          properties: {
            idDoctor: { 
              type: "string",
              ref:"doctor"
             }, 
            nota: { type: "string" }, 
          },
        },
      },
      sugerenciasMedicas: {
        type: "array", // Lista de alergias
        items: {
          type: "object",
          properties: {
            name: { type: "string" }, // Nombre del medicamento
            sugerencia: { type: "string" }, // Dosis
          }
        },
      },
      estadisticaSalud: {
        type: "array",
        items:{
          type: "object",
          properties: {
            name: { type: "string" }, // Nombre del contacto de emergencia
            estadistica: { type: "string" }, // Relación con el paciente
          }
        }
      },
      citas:{
        type: "array",
        items:{
          type:"any"
        }
      },
      createdAt: {
        type: "string",
        format: "date-time", // Fecha de creación del historial
      },
      updatedAt: {
        type: "string",
        format: "date-time", // Fecha de la última actualización del historial
      },
    },
    required: ["id"], 
    indexes: ["id","idPaciente"],
  } as const;

const schemaTyped = toTypedRxJsonSchema(HISTORIALMEDICO_SCHEMA_LITERAL);

export type RxHistorialMedicoDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const historialMedicoSchema:RxJsonSchema<RxHistorialMedicoDocType> = HISTORIALMEDICO_SCHEMA_LITERAL

export type HistorialMedicoType = RxHistorialMedicoDocType & {
  paciente: PacienteType | null
  citas: Array<CitaType> | null
}