import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DataViewModule } from 'primeng/dataview';

@Component({
  selector: 'app-examenes-medicos',
  standalone: true,
  imports: [DataViewModule,AvatarModule,CommonModule],
  templateUrl: './examenes-medicos.component.html',
  styleUrl: './examenes-medicos.component.css'
})
export class ExamenesMedicosComponent {
  public examenes:Array<any> = [
    {
      nombre:'Hemograma completo',
      detalle:'Evalúa las células sanguíneas para detectar anemia, infecciones o trastornos hematológicos.'
    },
    {
      nombre:'Radiografía de tórax',
      detalle:'Permite identificar problemas pulmonares, como neumonía o tumores.'
    },
    {
      nombre:'Prueba de glucosa',
      detalle:'Mide los niveles de azúcar en sangre para detectar diabetes o prediabetes.'
    }
  ]
}
