import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MediaServiceService } from '../../services/media-service.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SplitButtonModule } from 'primeng/splitbutton';



@Component({
  selector: 'app-video-conferencia',
  standalone: true,
  imports: [CommonModule,ButtonModule,DialogModule,DropdownModule,FormsModule,SplitButtonModule],
  templateUrl: './video-conferencia.component.html',
  styleUrl: './video-conferencia.component.css',
  providers:[MediaServiceService]
})
export class VideoConferenciaComponent implements OnInit {

  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement> | undefined;

  localStream!:MediaStream;
  incomingCall = false;
  callInProgress = false;
  audioEnabled = true;
  videoEnabled = true

  supportedConstraints:any = {};
  trackCapabilities:MediaTrackCapabilities | null = null;

  configVisible: boolean = false;

  microfono:{}|undefined = undefined;
  microfonos:Array<{}> | undefined = []

  audifino:{}|undefined = undefined;
  audifonos:Array<{}> | undefined = []

  public idCita:string | null = null

  public modoConferencia:{modo:string} = {
    modo:"Video y audio activados"
  };

  public modosVideoConferencia:Array<{}> = [
    {
      modo:"Solo activar audio"
    },
    {
      modo:"Video y audio activados"
    }
    
  ]
  
  private webRTCService = inject(MediaServiceService)
  private activateRotue = inject(ActivatedRoute)
  

  async ngOnInit():Promise<void> {
    try {

      this.idCita = this.activateRotue.snapshot.paramMap.get('id')
      // Asegúrate de que el roomId esté disponible antes de inicializar
      if (!this.idCita) {
        console.error('Error: roomId no proporcionado.');
        return;
      }

      // Unirse a la sala correspondiente
      this.webRTCService.joinRoom(this.idCita);

      // Inicializar la cámara/micrófono local
      this.localStream = await this.webRTCService.initializeMedia();
      if (this.localVideo) {
        this.localVideo.nativeElement.srcObject = this.localStream;
      }

      // Suscribirse a eventos del servicio
      this.webRTCService.incomingCall.subscribe(() => {
        this.incomingCall = true;
      });

      this.webRTCService.remoteStream.subscribe((remoteStream) => {
        if (this.remoteVideo) {
          this.remoteVideo.nativeElement.srcObject = remoteStream;
        }
      });

      // Cargar dispositivos disponibles
      this.microfonos = await this.webRTCService.getAvailableMicrophones();
      this.audifonos = await this.webRTCService.getAvailableAudioOutputs();
    } catch (error) {
      console.error('Error al inicializar el componente:', error);
    }
    
  }

  startCall(): void {
    if (this.idCita) {
      this.webRTCService.startCall(this.idCita);
      this.callInProgress = true;
    } else {
      console.error('No se puede iniciar la llamada sin un roomId.');
    }
  }

  async acceptCall(): Promise<void> {
    if (this.idCita) {
      await this.webRTCService.acceptCall(this.idCita);
      this.incomingCall = false;
      this.callInProgress = true;
    } else {
      console.error('No se puede aceptar la llamada sin un roomId.');
    }
  }

  stopCall(): void {
    this.webRTCService.stopCall();
    this.callInProgress = false;

    if (this.localVideo) {
      this.localVideo.nativeElement.srcObject = null;
    }
  }

  rejectCall(): void {
    this.webRTCService.rejectCall();
    this.incomingCall = false;
    this.callInProgress = false;

    if (this.remoteVideo) {
      this.remoteVideo.nativeElement.srcObject = null;
    }
  }

  modifyVideoTrackSize(){

  }

  toggleCamera() {
    this.videoEnabled = this.webRTCService.toggleVideo();
  }

  toggleAudio() {
    this.audioEnabled = this.webRTCService.toggleAudio();
  }

  showSettings(){
    this.configVisible = true;
  }

  changeMicro(selectedMicro:any){
    try {
      this.webRTCService.changeMicrophone(selectedMicro.value.id)
    } catch (error) {
      console.error("error al cambiar microfono")
    }
  }

  changeAudio(selectedAudio:any){
    console.log("change audio",selectedAudio)
    try {
      if(this.localVideo){}
      this.webRTCService.changeAudioOutput(this.localVideo?.nativeElement as HTMLMediaElement,selectedAudio.value.id)
    } catch (error) {
      console.error("error al cambiar audio")
    }
  }

  changeModoConferencia(selectedMode:any){
    const modoSeleccionado = selectedMode.value.modo
    if(modoSeleccionado == "Solo activar audio"){
      this.toggleToAudioOnly()
    }
    
    if(modoSeleccionado == "Video y audio activados"){
      this.toggleToVideo()
    }
  }

  toggleToAudioOnly(){
    this.webRTCService.switchToAudioOnly();
  }

  toggleToVideo(){
    this.webRTCService.switchToVideo()
  }

  

}
