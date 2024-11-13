import { inject, Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { AgendaType } from '../../../core/models/agenda.model';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AgendaMedicaService {
  private relativeUrl:string = 'api/agenda'

  private http:HttpClient = inject(HttpClient)

  constructor() { }

  async guardarAgendaMedica(agenda:AgendaType){
    return await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/${this.relativeUrl}`,agenda))
  }
}
