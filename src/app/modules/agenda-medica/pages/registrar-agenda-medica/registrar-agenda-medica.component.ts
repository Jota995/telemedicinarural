import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DoctorService } from '../../../../core/services/doctor.service';
import { DoctorType } from '../../../../core/models/doctor.model';
import { firstValueFrom } from 'rxjs';
import { AgendaMedicaService } from '../../services/agenda-medica.service';
import { AgendaType } from '../../../../core/models/agenda.model';
import { AlertService } from '../../../../core/services/alert.service';
import { combinarFechas } from '../../../../shared/helpers';


@Component({
  selector: 'app-registrar-agenda-medica',
  standalone: true,
  imports: [ReactiveFormsModule,DropdownModule,CalendarModule],
  templateUrl: './registrar-agenda-medica.component.html',
  styleUrl: './registrar-agenda-medica.component.css',
  providers:[DoctorService,AgendaMedicaService,AlertService]
})
export class RegistrarAgendaMedicaComponent implements OnInit {
 
  private fb:FormBuilder = inject(FormBuilder)
  private doctorService:DoctorService = inject(DoctorService)
  private agendaMedicaService = inject(AgendaMedicaService)
  private alertService = inject(AlertService)

  public especialidadesdMedicasDoctor:Array<string> = []
  public form!:FormGroup
  public doctor!:DoctorType | undefined
  public minDate = new Date()

  ngOnInit(): void {
    this.form = this.fb.group({
      idDoctor:['6726d7fbff280067c1de9582',Validators.required],
      especialidadMedica: [null,Validators.required],
      fecha:[null,Validators.required],
      hora:[null,Validators.required],
      estado:["disponible"],
    })

    this.doctorService
      .obtenerDoctor('6726d7fbff280067c1de9582')
      .then(doctor => {
        this.doctor = doctor

        if(!this.doctor?.especialidades || !this.doctor.especialidades.length) return

        this.especialidadesdMedicasDoctor = this.doctor.especialidades
      })
      .catch(err =>{
        console.log("ocurrio un error al obtener el doctor \n", err)
      })

  }

  async onSubmit(){
    try {
      const formValue = this.form.getRawValue();

      const agenda:AgendaType = {
        idDoctor: formValue.idDoctor,
        especialidad: formValue.especialidadMedica,
        fecha:combinarFechas(formValue.fecha,formValue.hora),
        estado:formValue.estado
      }

      console.log("form",this.form.getRawValue())
      console.log("agenda ",agenda)

      await this.agendaMedicaService.guardarAgendaMedica(agenda)

      this.alertService.showSuccess("Agenda guardada","Su hora ha sido guardada")
    } catch (error) {
      console.log("error al guardar cita",error)
    }
    

  }


}
