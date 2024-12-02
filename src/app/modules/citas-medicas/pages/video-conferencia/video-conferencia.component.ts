import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { MediaServiceService } from '../../services/media-service.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-video-conferencia',
  standalone: true,
  imports: [CommonModule,ButtonModule],
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
  
  private webRTCService = inject(MediaServiceService)

  async ngOnInit():Promise<void> {
    try {
      this.localStream = await this.webRTCService.initializateMedia()
    
      if(this.localVideo) this.localVideo.nativeElement.srcObject = this.localStream;

      this.webRTCService.incomingCall.subscribe(() =>{
        this.incomingCall = true
      })

      this.webRTCService.remoteStream.subscribe((remoteStream) =>{
        if(this.remoteVideo) this.remoteVideo.nativeElement.srcObject = remoteStream
      })
    } catch (error) {
      console.log("Error inizialating media :",error)
    }
  }

  startCall(){
    this.webRTCService.startCall()
    this.callInProgress = true;
  }

  aceptCall(){
    this.webRTCService.acceptCall();
    this.incomingCall = false;
    this.callInProgress = true;
  }

  stopCall(){
    this.webRTCService.startCall();
    this.callInProgress = false;

    if(this.localVideo) this.localVideo.nativeElement.srcObject = null;
  }

  rejectCall(){
    this.webRTCService.rejectCall();
    this.incomingCall = false;
    this.callInProgress = false;

    if(this.remoteVideo) this.remoteVideo.nativeElement.srcObject = null;
  }

  modifyVideoTrackSize(){

  }

  toggleCamera() {
    this.videoEnabled = this.webRTCService.toggleVideo();
  }

  toggleAudio() {
    this.audioEnabled = this.webRTCService.toggleAudio();
  }

  

}
