import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RxDatabaseService } from '../../../../core/services/database.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { distinct} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';
import { CitaType, RxCitaDocType } from '../../../../core/models/cita.model';
import { DoctorParamsQuery, DoctorService } from '../../../../core/services/doctor.service';
import { CitaService } from '../../../../core/services/cita.service';
import { DoctorType } from '../../../../core/models/doctor.model';
import {combinarFechas} from '../../../../shared/helpers'
import { UserService } from '../../../../core/services/user.service';


@Component({
  selector: 'app-agendar-cita',
  standalone: true,
  imports: [ButtonModule,DropdownModule,InputTextareaModule,CalendarModule,ReactiveFormsModule],
  templateUrl: './agendar-cita.component.html',
  styleUrl: './agendar-cita.component.css',
  providers:[DoctorService,CitaService,FormBuilder,AlertService, UserService]
})
export class AgendarCitaComponent implements OnInit {
  private alertService = inject(AlertService)
  private router = inject(Router)
  private fb = inject(FormBuilder);
  private citaService = inject(CitaService)
  private doctorService = inject(DoctorService)
  private userService = inject(UserService)

  private userValue = this.userService.getUserValue();

  public form!:FormGroup

  public EspecialidadesMedicas:Array<string> = [
    'neurologia',
    'cardiologia'
  ]

  public doctores:Array<DoctorType>  | undefined = []
  public doctor!:DoctorType | undefined

  public minDate = new Date()
  public maxDate!:Date;

  public defaultDate: Date = new Date();

  public agendaDoctor:Array<Date> = []

  public horasAgendar:Array<{}> = []

  private destroyRef = inject(DestroyRef)


  ngOnInit(): void {
    this.form = this.buildForm()

    this.defaultDate.setMinutes(0);
  }

  buildForm():FormGroup{
    const form = this.fb.group({
      idPaciente:[this.userValue?.IdPaciente,[Validators.required]],
      especialidad:[null,[Validators.required]],
      idDoctor:[null,[Validators.required]],
      fecha:[null,[Validators.required]],
      hora:[null,[Validators.required]],
      motivo:[null,[Validators.required]]
    })

    form.controls.idDoctor.disable({emitEvent:false})
    form.controls.fecha.disable({emitEvent:false})
    form.controls.hora.disable({emitEvent:false})
    form.controls.motivo.disable({emitEvent:false})

    form
      .controls
      .especialidad
      .valueChanges
      .pipe(
        distinct(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(async (especialidad) =>{
        form.controls.idDoctor.disable({emitEvent:false})
        form.controls.fecha.disable({emitEvent:false})
        form.controls.hora.disable({emitEvent:false})
        form.controls.motivo.disable({emitEvent:false})

        const doctorQuery:DoctorParamsQuery = {
          especialidad
        }

        this.doctores = await this.doctorService.obtenerDoctores(doctorQuery)

        if(!this.doctores) return

        form.controls.idDoctor.enable({emitEvent:false})

      })

    
    form
      .controls
      .idDoctor
      .valueChanges
      .pipe(
        distinct(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(async (idDoctor) =>{
        this.doctor = await this.doctorService.obtenerDoctor(idDoctor || '')

        console.log("agenda docta",this.doctor)


        if(!this.doctor || !this.doctor.agenda) return

        const agenda = this.doctor.agenda.filter((x:any) => x.estado === 'disponible').map((x:any) => new Date(x.fecha))
        
        if(agenda.length){
          this.maxDate = new Date(Math.max(...agenda.map((fecha:Date) => fecha.getTime())));
          this.agendaDoctor = this.generarFechasDeshabilitadas(agenda)
        }else{
          this.maxDate = new Date()
          this.agendaDoctor.push(new Date())
          form.controls.fecha.setErrors({sinAgenda:true})

          return
        }
        
        form.controls.fecha.enable({emitEvent:false})
        
      })

    form
      .controls
      .fecha
      .valueChanges
      .pipe(
        distinct(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(fecha =>{
        if(!this.doctor?.agenda) return

        const agenda = this.doctor
          .agenda
          .filter((x: any) => x.estado === 'disponible')
          .filter((x: any) => {
            // Convertir ambas fechas a formato 'YYYY-MM-DD' para comparar solo el día
            const fechaReferenciaISO = new Date(fecha!).toISOString().split('T')[0]; // Fecha de entrada sin horas
            const fechaAgendaISO = new Date(x.fecha).toISOString().split('T')[0]; // Fecha de la agenda sin horas
            return fechaAgendaISO === fechaReferenciaISO; // Comparar solo las fechas, sin horas
          })
          .map((x: any) => new Date(x.fecha));

        this.horasAgendar = agenda.map((fecha:Date) => {
          const horas = fecha.getHours().toString().padStart(2, '0'); // Asegurarse de que tenga 2 dígitos
          const minutos = fecha.getMinutes().toString().padStart(2, '0'); // Asegurarse de que tenga 2 dígitos
        
          return {
            hora: `${horas}:${minutos} hrs`,  // Formato "HH:MM"
            fecha: fecha                  // Fecha original
          };
        });

        if(!this.horasAgendar) return

        form.controls.hora.enable({emitEvent:false})
      })

    form
      .controls
      .hora
      .valueChanges
      .pipe(
        distinct(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value =>{
        form.controls.motivo.enable({emitEvent:false})
      })


    return form
  }

  async onSubmit(){
    try {

      const values = this.form.getRawValue();

      const cita:CitaType= {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
        idPaciente: values.idPaciente,
        idDoctor:values.idDoctor,
        especialidad: values.especialidad,
        fecha: combinarFechas(values.fecha,values.hora),
        estado:'pendiente',
        motivo:values.motivo,
        createdAt:new Date().toISOString(),
      }

      await this.citaService.agendarCita(cita)
    

      this.form.disable({emitEvent:false})

      this.alertService.showSuccess('Cita','Cita ingresada, se le enviara un correo con la confirmacion.')

      this.router.navigate(['/app/agenda/resumen'])


    } catch (error) {
      console.log("erro", error)
    }
  }

  obtenerFechasPorDia(fechaReferencia:Date, fechas:Array<Date>) {
    // Convertir la fecha de referencia a formato YYYY-MM-DD para comparar
    const fechaReferenciaISO = fechaReferencia.toISOString().split('T')[0];
  
    // Filtrar todas las fechas que coincidan con el mismo día
    return fechas.filter(fecha => {
      // Convertir cada fecha del array al formato YYYY-MM-DD
      const fechaISO = fecha.toISOString().split('T')[0];
      // Comparar solo la parte de la fecha (sin las horas)
      return fechaISO === fechaReferenciaISO;
    });
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
