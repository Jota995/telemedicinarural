import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DoctorService } from '../../../../core/services/doctor.service';
import { AgendaService } from '../../../../core/services/agenda.service';
import { AlertService } from '../../../../core/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { AgendaType } from '../../../../core/models/agenda.model';
import { combinarFechas,splitDateTime } from '../../../../shared/helpers';
import { CitaType } from '../../../../core/models/cita.model';
import { DoctorType } from '../../../../core/models/doctor.model';

@Component({
  selector: 'app-editar-agenda-medica',
  standalone: true,
  imports: [ReactiveFormsModule,DropdownModule,CalendarModule],
  templateUrl: './editar-agenda-medica.component.html',
  styleUrl: './editar-agenda-medica.component.css',
  providers:[DoctorService,AgendaService,AlertService]
})
export class EditarAgendaMedicaComponent implements OnInit{
  private fb:FormBuilder = inject(FormBuilder)
  private doctorService:DoctorService = inject(DoctorService)
  private agendaMedicaService = inject(AgendaService)
  private alertService = inject(AlertService)

  public form!:FormGroup;

  private activateRotue = inject(ActivatedRoute)

  private idAgenda:string | null = ''
  public agenda:AgendaType|null = null

  public minDate = new Date()
  public especialidadesdMedicasDoctor:Array<string> = []

  public doctor!:DoctorType | undefined

  ngOnInit(): void {

    this.form = this.fb.group({
      idDoctor:[null,[Validators.required]],
      especialidadMedica: [null,Validators.required],
      fecha:[null,Validators.required],
      hora:[null,Validators.required],
      estado:[null],
    })

    this.idAgenda = this.activateRotue.snapshot.paramMap.get('id')

    const idAgendaArray:Array<string> = [this.idAgenda ?? '']

    this.agendaMedicaService
      .obtenerAgendas({idsAgendas:idAgendaArray})
      .then((agendas)=>{

        if(!agendas || !agendas.length) return
        
        this.agenda = agendas[0]

        this.patchForm(this.agenda)

        this.doctorService
        .obtenerDoctor(this.agenda.idDoctor ?? '')
        .then(doctor => {
          this.doctor = doctor

          if(!this.doctor?.especialidades || !this.doctor.especialidades.length) return

          this.especialidadesdMedicasDoctor = this.doctor.especialidades
        })
        .catch(err =>{
          console.log("ocurrio un error al obtener el doctor \n", err)
        })

      })

  }

  patchForm(agenda:AgendaType){
    var fechaHora = splitDateTime(agenda.fecha ?? '');

    this.form.patchValue({
      idDoctor:agenda.idDoctor,
      especialidadMedica:agenda.especialidad,
      fecha: fechaHora.date,
      hora: fechaHora.time,
      estado:agenda.estado
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

      await this.agendaMedicaService.actualizarAgenda(agenda);

      this.alertService.showSuccess("Agenda Actualizada","Su hora ha sido actualizada")
      
    } catch (error) {
      console.log("error al actualizar cita",error)
    }
    

  }

}
