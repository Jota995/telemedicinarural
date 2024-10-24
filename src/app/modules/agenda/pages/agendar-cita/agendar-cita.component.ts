import { Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RxDatabaseService } from '../../../../core/services/database.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { RxDoctorCollecion } from '../../../../core/RxDB';
import { RxDocument } from 'rxdb';



@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [ButtonModule,DropdownModule,InputTextareaModule,CalendarModule,ReactiveFormsModule,AsyncPipe],
  templateUrl: './agendar-cita.component.html',
  styleUrl: './agendar-cita.component.css',
  providers:[RxDatabaseService,FormBuilder]
})
export class AgendarCitaComponent implements OnInit {
  
  private fb = inject(FormBuilder);
  private dbService = inject(RxDatabaseService)

  public form!:FormGroup

  public EspecialidadesMedicas:Array<string> = [
    'neurologia',
    'cardiologia'
  ]

  public doctores$!:Observable<any>
  public citasProgramadasEnElMes!:Observable<any>

  public minDate = new Date()
  public maxDate!:Date;

  public minHour = new Date()
  public maxHour = new Date()
  public defaultDate: Date = new Date();

  public agendaDoctor:Array<Date> = []

  public horasAgendar:Array<{}> = []

  

  ngOnInit(): void {
    this.form = this.fb.group({
      especialidad:[null,[Validators.required]],
      idPaciente:['d17b8f2a-6f01-4f57-853f-d5dee34960e0',[Validators.required]],
      idDoctor:[null,[Validators.required]],
      fecha:[null,[Validators.required]],
      hora:[null,[Validators.required]],
      motivo:[null,[Validators.required]]
    })

    this.defaultDate.setMinutes(0);

    // Setear la hora mínima (9:00 AM)
    this.minHour.setHours(9, 0, 0, 0); // 9 AM, 0 minutos, 0 segundos, 0 milisegundos

    // Setear la hora máxima (7:00 PM)
    this.maxHour.setHours(19, 0, 0, 0);

    this.doctores$ = this.dbService
      .db
      .doctor
      .find()
      .$
      .pipe(
        tap((values:Array<any>) => {
          const agenda = values[0].agenda.map((date:string) => new Date(date))
          this.maxDate = new Date(Math.max(...agenda.map((fecha:Date) => fecha.getTime())));
          this.agendaDoctor = this.generarFechasDeshabilitadas(agenda)
          this.horasAgendar = agenda.map((fecha:Date) => {
            const horas = fecha.getHours().toString().padStart(2, '0'); // Asegurarse de que tenga 2 dígitos
            const minutos = fecha.getMinutes().toString().padStart(2, '0'); // Asegurarse de que tenga 2 dígitos
          
            return {
              hora: `${horas}:${minutos} hrs`,  // Formato "HH:MM"
              fecha: fecha                  // Fecha original
            };
          });
        })
      )

    this.citasProgramadasEnElMes = this.dbService
      .db
      .cita
      .count()
      .$
  }

  async onSubmit(){
    try {
      console.log("form",this.form.getRawValue())

      const values = this.form.getRawValue();

      const cita = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        idPaciente: values.idPaciente,
        idDoctor:values.idDoctor,
        especialidad: values.especialidad,
        fecha: this.combinarFechas(values.fecha,values.hora),
        estado:'programada',
        motivo:values.motivo,
        createdAt:new Date().toISOString()
      }

      await this.dbService.db.cita.insert(cita)

      this.form.disable()

      console.log("cita creada")

    } catch (error) {
      
    }
  }

  combinarFechas(fechaPrincipal:Date, fechaHora:Date):string {
    // Crear una nueva fecha basada en la fechaPrincipal (para no modificar el original)
    const nuevaFecha = new Date(fechaPrincipal);
  
    // Establecer las horas y minutos de la segunda fecha (fechaHora) en la nueva fecha
    nuevaFecha.setHours(fechaHora.getHours());
    nuevaFecha.setMinutes(fechaHora.getMinutes());
    nuevaFecha.setSeconds(0);  // Puedes ajustar según sea necesario
    nuevaFecha.setMilliseconds(0);  // Opcional: ajustar milisegundos
  
    return nuevaFecha.toISOString();
  }

  generarFechasDeshabilitadas(fechasPermitidas: Date[]): Date[] {
    const fechasDeshabilitadas: Date[] = [];
  
    // Rango mínimo es "hoy"
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Asegurarse que el tiempo sea 00:00:00
    
    // Rango máximo es la última fecha del array de fechas permitidas
    const fechaMaxima = new Date(Math.max(...fechasPermitidas.map(f => f.getTime())));
    fechaMaxima.setHours(0, 0, 0, 0); // Ajustar la hora a 00:00:00
    
    // Empezamos desde "hoy" y recorremos hasta la fecha máxima
    let fechaActual = new Date(hoy);
  
    while (fechaActual <= fechaMaxima) {
      // Convertir fecha actual a formato ISO para comparar solo las fechas (sin horas)
      const fechaISO = fechaActual.toISOString().split('T')[0];
  
      // Verificar si la fecha actual NO está en el array de fechas permitidas
      if (!fechasPermitidas.some(f => f.toISOString().split('T')[0] === fechaISO)) {
        // Si no está en el array de fechas permitidas, agregarla al array de fechas deshabilitadas
        fechasDeshabilitadas.push(new Date(fechaActual));
      }
  
      // Avanzar un día
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
  
    return fechasDeshabilitadas;
  }
}
