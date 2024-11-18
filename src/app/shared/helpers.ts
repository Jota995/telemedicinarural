export function combinarFechas(fechaPrincipal:Date, fechaHora:Date):string {
    // Crear una nueva fecha basada en la fechaPrincipal (para no modificar el original)
    const nuevaFecha = new Date(fechaPrincipal);
  
    // Establecer las horas y minutos de la segunda fecha (fechaHora) en la nueva fecha
    nuevaFecha.setHours(fechaHora.getHours());
    nuevaFecha.setMinutes(fechaHora.getMinutes());
    nuevaFecha.setSeconds(0);  // Puedes ajustar según sea necesario
    nuevaFecha.setMilliseconds(0);  // Opcional: ajustar milisegundos
  
    return nuevaFecha.toISOString();
  }

  export function splitDateTime(inputDate:string) {
    // Convertir la entrada a objeto Date
    const date = new Date(inputDate);

    if (isNaN(date.getTime())) {
        throw new Error("La fecha proporcionada no es válida.");
    }

    // Extraer las partes de la fecha (día, mes, año)
    const year = date.getFullYear();
    const month = date.getMonth(); // Mes (0-11)
    const day = date.getDate();

    // Extraer las partes del tiempo (hora, minuto, segundo)
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Crear objetos Date separados
    const datePart = new Date(year, month, day); // Solo contiene la fecha
    const timePart = new Date(1970, 0, 1, hours, minutes, seconds); // Solo contiene la hora

    // Devolver el objeto con ambas partes
    return {
        date: datePart,
        time: timePart,
    };
}