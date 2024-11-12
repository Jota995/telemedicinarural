import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DoctorService } from '../../../../core/services/doctor.service';
import { DoctorType } from '../../../../core/models/doctor.model';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-registrar-agenda-medica',
  standalone: true,
  imports: [ReactiveFormsModule,DropdownModule,CalendarModule],
  templateUrl: './registrar-agenda-medica.component.html',
  styleUrl: './registrar-agenda-medica.component.css',
  providers:[DoctorService]
})
export class RegistrarAgendaMedicaComponent implements OnInit {
 
  private fb:FormBuilder = inject(FormBuilder)
  private doctorService:DoctorService = inject(DoctorService)
  public especialidadesdMedicasDoctor:Array<string> = []
  public form!:FormGroup
  public doctor!:DoctorType | undefined
  public minDate = new Date()

  ngOnInit(): void {
    this.form = this.fb.group({
      especialidadMedica: [null,Validators.required],
      fecha:[null,Validators.required],
      hora:[null,Validators.required]
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

  onSubmit(){
    console.log("form",this.form.getRawValue())
  }

}
