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
        maxLength: 100,
      },
      idPaciente: {
        type: "string", // Identificador del paciente al que pertenece este historial
        ref: "paciente", // Referencia a la colección de pacientes (si la hay)
      },
      idCitasMedicas: {
        type: "array",
        ref:"cita",
        items:{
          type:"string"
        }
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
      createdAt: {
        type: "string",
        format: "date-time", // Fecha de creación del historial
      },
      updatedAt: {
        type: "string",
        format: "date-time", // Fecha de la última actualización del historial
      },
    },
    required: ["id"]
  } as const;

const schemaTyped = toTypedRxJsonSchema(HISTORIALMEDICO_SCHEMA_LITERAL);

export type RxHistorialMedicoDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const historialMedicoSchema:RxJsonSchema<RxHistorialMedicoDocType> = HISTORIALMEDICO_SCHEMA_LITERAL

export type HistorialMedicoType = RxHistorialMedicoDocType & {
  paciente: PacienteType | null
  citas: Array<CitaType> | null
}