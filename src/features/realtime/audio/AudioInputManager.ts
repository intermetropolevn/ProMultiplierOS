/**
 * AudioInputManager
 * Controls audio stream acquisition, permission handling, volume metering,
 * and audio state tracking without silent capture.
 */

export interface AudioLevelListener {
  (volume: number): void;
}

export class AudioInputManager {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | null = null;
  private volumeListeners: AudioLevelListener[] = [];
  private isCapturing: boolean = false;
  private isPaused: boolean = false;

  public async startCapture(): Promise<boolean> {
    if (this.isCapturing && !this.isPaused) {
      return true;
    }

    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone audio capture is not supported in this environment.');
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        if (this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }

        const source = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.5;
        source.connect(this.analyser);

        this.startVolumeMonitoring();
      }

      this.isCapturing = true;
      this.isPaused = false;
      return true;
    } catch (error) {
      console.warn('AudioInputManager: Microphone access was not granted or failed:', error);
      this.stopCapture();
      return false;
    }
  }

  public pauseCapture(): void {
    if (!this.isCapturing) return;
    this.isPaused = true;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
    }
    this.notifyVolume(0);
  }

  public resumeCapture(): void {
    if (!this.isCapturing) return;
    this.isPaused = false;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
    }
  }

  public stopCapture(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      if (this.audioContext.state !== 'closed') {
        this.audioContext.close().catch(() => {});
      }
      this.audioContext = null;
    }

    this.analyser = null;
    this.isCapturing = false;
    this.isPaused = false;
    this.notifyVolume(0);
  }

  public onVolumeChange(listener: AudioLevelListener): () => void {
    this.volumeListeners.push(listener);
    return () => {
      this.volumeListeners = this.volumeListeners.filter(l => l !== listener);
    };
  }

  public getIsCapturing(): boolean {
    return this.isCapturing;
  }

  public getIsPaused(): boolean {
    return this.isPaused;
  }

  private startVolumeMonitoring(): void {
    if (!this.analyser) return;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      if (!this.isCapturing || this.isPaused || !this.analyser) {
        this.notifyVolume(0);
        return;
      }

      this.analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      // Normalize 0 - 100 with scaling for visual sensitivity
      const normalized = Math.min(100, Math.round((average / 128) * 100));
      this.notifyVolume(normalized);

      this.animationFrameId = requestAnimationFrame(update);
    };

    update();
  }

  private notifyVolume(volume: number): void {
    this.volumeListeners.forEach(fn => fn(volume));
  }
}
