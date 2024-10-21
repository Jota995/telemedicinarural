import { ExtractDocumentTypeFromTypedRxJsonSchema, RxJsonSchema, toTypedRxJsonSchema } from "rxdb";

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
      consultasMedicas: {
        type: "array", // Registro de consultas médicas recientes
        items: {
          type: "object",
          properties: {
            idDoctor:{
              ref:'doctor',
              type:'string'
            },
            fecha: { type: "string",format: "date-time" },
          },
        },
      },
      estadisticaSalud: {
        type: "object", // Información del contacto de emergencia
        properties: {
          name: { type: "string" }, // Nombre del contacto de emergencia
          estadistica: { type: "string" }, // Relación con el paciente
        },
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
    indexes: ["idPaciente", "id"],
  };

  const schemaTyped = toTypedRxJsonSchema(HISTORIALMEDICO_SCHEMA_LITERAL);

  export type RxHistorialMedicoType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

  export const HISTORIALMEDICO_SCHEMA:RxJsonSchema<RxHistorialMedicoType> = HISTORIALMEDICO_SCHEMA_LITERAL