import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DoctorService } from '../../../../core/services/doctor.service';
import { DoctorType } from '../../../../core/models/doctor.model';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-filtrar-agenda-medica',
  standalone: true,
  imports: [ReactiveFormsModule,DropdownModule,CalendarModule,RouterModule],
  templateUrl: './filtrar-agenda-medica.component.html',
  styleUrl: './filtrar-agenda-medica.component.css',
  providers:[DoctorService]
})
export class FiltrarAgendaMedicaComponent implements OnInit {
  
  private fb:FormBuilder = inject(FormBuilder)
  private doctorService:DoctorService = inject(DoctorService)
  private router = inject(Router)
  public especialidadesdMedicasDoctor:Array<string> = []

  public form!:FormGroup
  public doctor!:DoctorType | undefined
  public estadosCitaMedica:Array<string> = ["disponible", "cancelada", "completada", "no asistida","pendiente"]

  ngOnInit(): void {
    this.form = this.fb.group({
      especialidad: [null,Validators.required],
      fecha:[null,Validators.required],
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

  onSubmit(){
    console.log("form",this.form.getRawValue())
    const FilterValues = this.form.getRawValue();
    this.router.navigate(['/app/agenda-medica'],{
      queryParams:{
        especialidadMedica: FilterValues.especialidad || null,
        estado:FilterValues.estado || null,
        fechaDesde: (FilterValues.fecha[0] as Date).toISOString() || null,
        fechaHasta: (FilterValues.fecha[1] as Date).toISOString() || null
      }
    })
  }
}
