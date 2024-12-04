import { EventEmitter, Injectable } from '@angular/core';
import { io,Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MediaServiceService {

  private socket:Socket;
  private peerConnection!:RTCPeerConnection;
  private localStream!:MediaStream;

  public incomingCall = new EventEmitter<void>();
  public callAccepted = new EventEmitter<MediaStream>();
  public remoteStream = new EventEmitter<MediaStream>();

  constructor() {
    this.socket = io('http://localhost:3000');
    this.initializateSocketEvents();
  }

  async initializateMedia(){
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true})
      return this.localStream;
    } catch (error) {
      console.log("error accesing media devices",error)
      throw error;
    }
  }

  initializateSocketEvents() {
    this.socket.on('offer',async (offer) =>{
      console.log("Recived offer")
      this.incomingCall.emit();
      await this.createPeerConnection();
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    });

    this.socket.on('answer',(answer) =>{
      console.log("Answer recived");
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));

    });

    this.socket.on('candidate', (candidate) =>{
      console.log("Ice candidate recived")
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

  }

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers:[{urls:'stun:stun.l.google.com:19302'}]
    })

    this.peerConnection.onicecandidate = (event) =>{
      if(event.candidate) this.socket.emit('candidate',event.candidate)
    }

    this.peerConnection.ontrack = (event) =>{
      console.log("setting remote stream")
      this.remoteStream.emit(event.streams[0])
    }
  }

  async startCall(){
    await this.createPeerConnection();
    this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track,this.localStream));
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    this.socket.emit('offer',this.peerConnection.localDescription)
  }

  async acceptCall(){
    this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track,this.localStream));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.socket.emit('answer',this.peerConnection.localDescription);
  }

  rejectCall(){
    this.cleanUp()
  }

  stopCall(){
    this.cleanUp()

    if(this.localStream){
      this.localStream.getTracks().forEach(track => track.stop())
    }

    this.remoteStream.emit(null as any);
  }

  cleanUp(){
    if(this.peerConnection){
      this.peerConnection.close()
      this.peerConnection = null as any;
    }
  }

  modifyVideoTrackSize(width:number,height:number):boolean{
    if(this.localStream){
      const videoTrack = this.localStream.getVideoTracks()[0];
      const trackCapabilities = videoTrack.getCapabilities();
      
      if(trackCapabilities?.width && trackCapabilities?.height){
        videoTrack.applyConstraints({
          width:{
            ideal:width
          },
          height:{
            ideal:height
          }
        })

        return true
      }
    }

    return false;
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled; // Devuelve el estado actualizado
      }
    }
    return false;
  }
  
  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled; // Devuelve el estado actualizado
      }
    }
    return false;
  }

  async getAvailableMicrophones(): Promise<{ id: string; name: string }[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const microphones = devices
        .filter((device) => device.kind === 'audioinput')
        .map((device) => ({ id: device.deviceId, name: device.label || 'Micrófono sin nombre' }));
      return microphones;
    } catch (error) {
      console.error('Error al obtener dispositivos de audio:', error);
      return [];
    }
  }

  async changeMicrophone(deviceId: string): Promise<void> {
    try {
      if (!this.localStream) {
        throw new Error('El stream local no está inicializado.');
      }
  
      // Detener la pista de audio actual
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.stop();
        this.localStream.removeTrack(audioTrack);
      }
  
      // Obtener un nuevo stream con el micrófono seleccionado
      const newAudioStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
      });
  
      // Reemplazar la pista en el stream local
      const newAudioTrack = newAudioStream.getAudioTracks()[0];
      this.localStream.addTrack(newAudioTrack);
  
      // Si la conexión está activa, reemplazar la pista en el peer connection
      if (this.peerConnection) {
        const sender = this.peerConnection
          .getSenders()
          .find((s) => s.track?.kind === 'audio');
        if (sender) {
          sender.replaceTrack(newAudioTrack);
        }
      }
    } catch (error) {
      console.error('Error al cambiar el micrófono:', error);
      throw error;
    }
  }

  async getAvailableAudioOutputs(): Promise<{ id: string; name: string }[]> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioOutputs = devices
        .filter((device) => device.kind === 'audiooutput')
        .map((device) => ({ id: device.deviceId, name: device.label || 'Salida sin nombre' }));
      return audioOutputs;
    } catch (error) {
      console.error('Error al obtener dispositivos de salida de audio:', error);
      return [];
    }
  }
  
  changeAudioOutput(element: HTMLMediaElement, deviceId: string): void {
    if (!('setSinkId' in element)) {
      console.warn('El navegador no soporta setSinkId.');
      return;
    }
  
    element.setSinkId(deviceId).then(() => {
      console.log(`Salida de audio cambiada a: ${deviceId}`);
    }).catch((error) => {
      console.error('Error al cambiar la salida de audio:', error);
    });
  }
  
}
