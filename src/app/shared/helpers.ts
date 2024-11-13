export function combinarFechas(fechaPrincipal:Date, fechaHora:Date):string {
    // Crear una nueva fecha basada en la fechaPrincipal (para no modificar el original)
    const nuevaFecha = new Date(fechaPrincipal);
  
    // Establecer las horas y minutos de la segunda fecha (fechaHora) en la nueva fecha
    nuevaFecha.setHours(fechaHora.getHours());
    nuevaFecha.setMinutes(fechaHora.getMinutes());
    nuevaFecha.setSeconds(0);  // Puedes ajustar según sea necesario
    nuevaFecha.setMilliseconds(0);  // Opcional: ajustar milisegundos
  
    return nuevaFecha.toJSON();
  }