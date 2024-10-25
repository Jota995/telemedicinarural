import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';


@Injectable()
export class AlertService {
  private messageService = inject(MessageService)

  private messages: any[] = [];

  constructor() { }

  showSuccess(summary: string, detail: string) {
    this.addMessage({ severity: 'success', summary, detail });
  }

  showError(summary: string, detail: string) {
    this.addMessage({ severity: 'error', summary, detail });
  }

  showInfo(summary: string, detail: string) {
    this.addMessage({ severity: 'info', summary, detail });
  }

  showWarn(summary: string, detail: string) {
    this.addMessage({ severity: 'warn', summary, detail });
  }

  private addMessage(message: any) {
    this.messages.push(message);
    this.messageService.add(message);
  }

}
