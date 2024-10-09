import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { DataViewModule } from 'primeng/dataview';


@Component({
  selector: 'app-historial-medico',
  standalone: true,
  imports: [AvatarModule,AvatarGroupModule,CardModule,DataViewModule,CommonModule],
  templateUrl: './historial-medico.component.html',
  styleUrl: './historial-medico.component.css'
})
export class HistorialMedicoComponent {
  public alergias = [
    {
      'nombre': 'Alergia Maní',
      'severidad': 'Alta'
    },
    {
      'nombre': 'Alergia Aspirina',
      'severidad': 'Baja'
    }
  ]

  public consultasMedicas = [
    {
      'doctor':'Dr. Johnson',
      'especialidad':'Dermatólogo',
      'fecha': '04/10/2024'
    },
    {
      'doctor':'Dr. Lee',
      'especialidad':'Cardiólogo',
      'fecha': '01/10/2024'
    }
  ]

  public estadisticasSalud =[
    {
      'nombre':'Presión Arterial',
      'medicion':'120/80',
      'porcentaje':'-5%'
    },
    {
      'nombre':'Frecuencia Cardiaca',
      'medicion':'70bpm',
      'porcentaje':'+2%'
    }
  ]
}
