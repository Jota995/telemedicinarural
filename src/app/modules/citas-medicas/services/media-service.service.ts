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
  
}
