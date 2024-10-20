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
      patientId: {
        type: "string", // Identificador del paciente al que pertenece este historial
        ref: "patients", // Referencia a la colección de pacientes (si la hay)
      },
      name: {
        type: "string", // Nombre del paciente
        maxLength: 100,
      },
      birthDate: {
        type: "string",
        format: "date", // Fecha de nacimiento del paciente
      },
      gender: {
        type: "string",
        enum: ["male", "female", "other"], // Género del paciente
      },
      medicalConditions: {
        type: "array", // Lista de condiciones médicas preexistentes
        items: {
          type: "string",
        },
      },
      medications: {
        type: "array", // Lista de medicamentos actuales
        items: {
          type: "object",
          properties: {
            name: { type: "string" }, // Nombre del medicamento
            dosage: { type: "string" }, // Dosis
            frequency: { type: "string" }, // Frecuencia de uso
          },
        },
      },
      allergies: {
        type: "array", // Lista de alergias
        items: {
          type: "object",
          properties: {
            name: { type: "string" }, // Nombre del medicamento
            severity: { type: "string" }, // Dosis
          }
        },
      },
      surgeries: {
        type: "array", // Historial de cirugías
        items: {
          type: "object",
          properties: {
            surgeryName: { type: "string" }, // Nombre de la cirugía
            date: { type: "string", format: "date" }, // Fecha de la cirugía
          },
        },
      },
      familyHistory: {
        type: "array", // Historial médico familiar
        items: {
          type: "object",
          properties: {
            condition: { type: "string" }, // Condición familiar (e.g., diabetes, cáncer)
            relative: { type: "string" }, // Pariente afectado
          },
        },
      },
      recentConsultations: {
        type: "array", // Registro de consultas médicas recientes
        items: {
          type: "object",
          properties: {
            doctorId: { type: "string" }, // ID del doctor
            consultationDate: { type: "string", format: "date-time" }, // Fecha de la consulta
            diagnosis: { type: "string" }, // Diagnóstico de la consulta
            treatment: { type: "string" }, // Tratamiento recomendado
          },
        },
      },
      emergencyContact: {
        type: "object", // Información del contacto de emergencia
        properties: {
          name: { type: "string" }, // Nombre del contacto de emergencia
          relationship: { type: "string" }, // Relación con el paciente
          phone: { type: "string" }, // Número de teléfono del contacto de emergencia
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
    required: ["id", "patientId", "name"], // Campos obligatorios
    indexes: ["patientId", "name"], // Índices para mejorar las consultas por paciente
  };

  const schemaTyped = toTypedRxJsonSchema(HISTORIALMEDICO_SCHEMA_LITERAL);

  export type RxHistorialMedicoType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

  export const HISTORIALMEDICO_SCHEMA:RxJsonSchema<RxHistorialMedicoType> = HISTORIALMEDICO_SCHEMA_LITERAL