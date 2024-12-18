import { EventEmitter, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class MediaServiceService {
  private socket: Socket;
  private peerConnection!: RTCPeerConnection;
  private localStream!: MediaStream;

  public incomingCall = new EventEmitter<void>();
  public callAccepted = new EventEmitter<MediaStream>();
  public remoteStream = new EventEmitter<MediaStream>();

  constructor() {
    this.socket = io('http://localhost:3000'); // URL del servidor Socket.IO
  }

  async initializeMedia(): Promise<MediaStream> {
    const constraints = {
      audio: true,
      video: {
        width: { ideal: 640 },
        height: { ideal: 360 },
        frameRate: { ideal: 15, max: 30 },
      },
    };

    this.localStream = await navigator.mediaDevices.getUserMedia(constraints);
    return this.localStream;
  }

  joinRoom(roomId: string): void {
    this.socket.emit('join-room', roomId);
    console.log(`Unido a la sala: ${roomId}`);
    this.initializeSocketEvents(roomId);
  }

  private initializeSocketEvents(roomId: string): void {
    this.socket.on('offer', async (data) => {
      const { offer } = data;
      console.log('Oferta recibida');
      this.incomingCall.emit();
      await this.createPeerConnection(roomId);
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    });

    this.socket.on('answer', (data) => {
      const { answer } = data;
      console.log('Respuesta recibida');
      this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    this.socket.on('candidate', (data) => {
      const { candidate } = data;
      console.log('Candidato ICE recibido');
      this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });
  }

  private async createPeerConnection(roomId: string): Promise<void> {
    this.peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('candidate', { roomId, candidate: event.candidate });
      }
    };

    this.peerConnection.ontrack = (event) => {
      console.log('Stream remoto recibido');
      this.remoteStream.emit(event.streams[0]);
    };
  }

  async startCall(roomId: string): Promise<void> {
    await this.createPeerConnection(roomId);
    this.localStream.getTracks().forEach((track) =>
      this.peerConnection.addTrack(track, this.localStream)
    );

    const offer = await this.peerConnection.createOffer();
    const modifiedSDP = this.prioritizeCodec(offer.sdp || "", "VP9"); // Cambia a H.264 si lo prefieres
    const newOffer: RTCSessionDescriptionInit = { type: offer.type, sdp: modifiedSDP };
    await this.peerConnection.setLocalDescription(newOffer);
    this.socket.emit('offer', { roomId, offer: this.peerConnection.localDescription });

    // Ajustar parámetros del transmisor después de iniciar la llamada
    this.adjustSenderParameters();

    // Iniciar monitoreo de calidad de red
    this.monitorNetworkQuality();
    setInterval(() => this.adjustVideoQuality(), 50000); // Ajustar cada 10 segundos
  }

  async acceptCall(roomId: string): Promise<void> {
    this.localStream.getTracks().forEach((track) =>
      this.peerConnection.addTrack(track, this.localStream)
    );
  
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    this.socket.emit('answer', { roomId, answer: this.peerConnection.localDescription });
  
    // Configurar simulcast después de aceptar la llamada
    this.configureSimulcast();
  }

  rejectCall(): void {
    this.cleanup();
  }

  stopCall(): void {
    this.cleanup();

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }

    this.remoteStream.emit(null as any);
  }

  private cleanup(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
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

  prioritizeCodec(sdp: string, codec: string): string {
    const lines = sdp.split("\r\n");
    const mLineIndex = lines.findIndex(line => line.startsWith("m=video"));

    if (mLineIndex === -1) return sdp;

    const codecRegex = new RegExp(`a=rtpmap:(\\d+) ${codec}`);
    const codecLine = lines.find(line => codecRegex.test(line));

    if (codecLine) {
      const codecPayload = codecLine.match(codecRegex)?.[1];
      if (codecPayload) {
        const mLine = lines[mLineIndex].split(" ");
        const newMLine = [
          ...mLine.slice(0, 3),
          codecPayload,
          ...mLine.slice(3).filter(payload => payload !== codecPayload),
        ];
        lines[mLineIndex] = newMLine.join(" ");
      }
    }

    return lines.join("\r\n");
  }

  private adjustSenderParameters(): void {
    const sender = this.peerConnection.getSenders().find(s => s.track?.kind === "video");

    if (sender) {
      const parameters = sender.getParameters();
      if (!parameters.encodings) {
        parameters.encodings = [{}];
      }

      // Ajustar parámetros como bitrate máximo
      parameters.encodings[0].maxBitrate = 500_000; // 500 kbps
      parameters.encodings[0].scaleResolutionDownBy = 1; // No reducir resolución

      sender.setParameters(parameters).catch(console.error);
    }
  }

  private configureSimulcast(): void {
    const sender = this.peerConnection.getSenders().find(s => s.track?.kind === "video");
  
    if (sender) {
      const parameters = sender.getParameters();
  
      // Inicializar encodings si no están definidas
      if (!parameters.encodings || parameters.encodings.length === 0) {
        parameters.encodings = [
          { rid: "low" },
          { rid: "medium" },
          { rid: "high" }
        ];
      }
  
      // Establecer parámetros para simulcast
      if (parameters.encodings.length >= 3) {
        parameters.encodings[0].maxBitrate = 150_000; // Baja calidad (150 kbps)
        parameters.encodings[1].maxBitrate = 300_000; // Media calidad (300 kbps)
        parameters.encodings[2].maxBitrate = 800_000; // Alta calidad (800 kbps)
      } else {
        console.warn("Simulcast no soportado con múltiples encodings.");
      }
  
      // Aplicar cambios a través de setParameters
      sender.setParameters(parameters)
        .then(() => console.log("Simulcast configurado correctamente"))
        .catch(error => console.error("Error configurando simulcast:", error));
    } else {
      console.warn("No se encontró un transmisor de video para configurar simulcast.");
    }
  }


  private monitorNetworkQuality(): void {
    const sender = this.peerConnection.getSenders().find(s => s.track?.kind === "video");
    
    if (sender && sender.track) {
      const videoTrack: MediaStreamTrack = sender.track; // Asegúrate de usar la pista asociada
      console.log(`Track encontrada: ${videoTrack.kind}`);
      // Ahora puedes trabajar con videoTrack como MediaStreamTrack
    }
  
    const getStatsInterval = setInterval(() => {
      this.peerConnection.getStats().then(stats => {
        stats.forEach(report => {
          if (report.type === "outbound-rtp" && report.kind === "video") {
            const bitrate = (report.bytesSent * 8) / (report.timestamp / 1000); // Bitrate estimado en bits/segundo
            console.log(`Bitrate: ${bitrate} bps`);
          }
          
          if (report.type === "candidate-pair" && report.state === "succeeded") {
            console.log(`Ancho de banda disponible: ${report.availableOutgoingBitrate} bps`);
            console.log(`Tiempo de ida y vuelta: ${report.currentRoundTripTime} ms`);
          }
        });
      }).catch(error => {
        console.error("Error obteniendo estadísticas de conexión:", error);
        clearInterval(getStatsInterval);
      });
    }, 5000); // Actualizar cada 5 segundos
  }

  private adjustVideoQuality(): void {
    const sender = this.peerConnection.getSenders().find(s => s.track?.kind === "video");
  
    if (sender) {
      const parameters = sender.getParameters();
  
      if (!parameters.encodings || parameters.encodings.length === 0) {
        parameters.encodings = [{}];
      }
  
      // Supongamos que usamos valores de ancho de banda disponible para ajustar
      this.peerConnection.getStats().then(stats => {
        stats.forEach(report => {
          if (report.type === "candidate-pair" && report.state === "succeeded") {
            const availableBitrate = report.availableOutgoingBitrate;
  
            // Ajustar bitrate con base en ancho de banda disponible
            if (availableBitrate < 300_000) {
              console.log("Red pobre: Ajustando a baja calidad");
              parameters.encodings[0].maxBitrate = 150_000;
            } else if (availableBitrate < 800_000) {
              console.log("Red moderada: Ajustando a calidad media");
              parameters.encodings[0].maxBitrate = 500_000;
            } else {
              console.log("Buena red: Ajustando a alta calidad");
              parameters.encodings[0].maxBitrate = 1_500_000;
            }
  
            sender.setParameters(parameters).then(() => {
              console.log("Calidad de video ajustada");
            }).catch(error => {
              console.error("Error ajustando parámetros de video:", error);
            });
          }
        });
      });
    } else {
      console.warn("No se encontró un transmisor de video para ajustar la calidad.");
    }
  }

  switchToAudioOnly(): void {
    if (this.localStream) {
      // Deshabilitar la pista de video
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = false;
      }
  
      // Mantener habilitada la pista de audio
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = true;
      }
  
      console.log("Modo solo micrófono activado");
    }
  }

  switchToVideo(): void {
    if (this.localStream) {
      // Habilitar la pista de video
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = true;
      }
  
      console.log("Modo video completo activado");
    }
  }
  
  
}
