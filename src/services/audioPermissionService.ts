/**
 * Contextual Microphone Permission & Lifecycle Service
 *
 * Enforces the strict CareerOS audio lifecycle:
 * Feature Intent -> Microphone Pre-flight -> Browser Permission -> Microphone Ready -> Session Started
 *
 * Guarantees:
 * - NEVER requests microphone permission on initial platform load, login, or page navigation.
 * - Passively checks existing browser permission state via Permissions API (if supported) without prompting.
 * - Reuses granted permission within the session so users aren't repeatedly prompted.
 * - Cleanly stops and releases MediaStream tracks when an audio session ends.
 */

export type MicrophonePermissionState =
  | 'not_requested'
  | 'granted'
  | 'denied'
  | 'unavailable';

export type AudioLifecycleStage =
  | 'idle'
  | 'feature_intent'
  | 'mic_preflight'
  | 'requesting_browser_permission'
  | 'mic_ready'
  | 'session_started'
  | 'non_voice_fallback';

export type AudioFeatureContext = 'live_interview' | 'business_english';

interface AudioPermissionSnapshot {
  permissionState: MicrophonePermissionState;
  lifecycleStage: AudioLifecycleStage;
  activeFeature: AudioFeatureContext | null;
  hasActiveStream: boolean;
  lastError: string | null;
}

type Listener = (snapshot: AudioPermissionSnapshot) => void;

class AudioPermissionServiceImpl {
  private permissionState: MicrophonePermissionState = 'not_requested';
  private lifecycleStage: AudioLifecycleStage = 'idle';
  private activeFeature: AudioFeatureContext | null = null;
  private activeStream: MediaStream | null = null;
  private lastError: string | null = null;
  private sessionGrantedVerified: boolean = false;
  private listeners: Set<Listener> = new Set();

  /**
   * Passively checks if the browser has already granted or blocked microphone access
   * WITHOUT triggering a browser permission prompt.
   */
  public async checkPassivePermissionState(): Promise<MicrophonePermissionState> {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      this.permissionState = 'unavailable';
      this.notify();
      return this.permissionState;
    }

    // If we already verified and acquired microphone access during this session
    if (this.sessionGrantedVerified && this.permissionState === 'granted') {
      return 'granted';
    }

    // Check if mediaDevices API exists at all
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
      // Note: SpeechRecognition might still exist in some environments, or device has no mic API
      this.permissionState = 'unavailable';
      this.notify();
      return this.permissionState;
    }

    // Passive query via Permissions API (never triggers a prompt)
    if (navigator.permissions && typeof navigator.permissions.query === 'function') {
      try {
        const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        if (status.state === 'granted') {
          this.permissionState = 'granted';
        } else if (status.state === 'denied') {
          this.permissionState = 'denied';
          this.sessionGrantedVerified = false;
        } else {
          this.permissionState = 'not_requested';
        }

        status.onchange = () => {
          if (status.state === 'granted') {
            this.permissionState = 'granted';
          } else if (status.state === 'denied') {
            this.permissionState = 'denied';
            this.sessionGrantedVerified = false;
            this.releaseStream();
          } else {
            this.permissionState = 'not_requested';
            this.sessionGrantedVerified = false;
          }
          this.notify();
        };
      } catch {
        // Fallback if browser doesn't support 'microphone' query in navigator.permissions
      }
    }

    this.notify();
    return this.permissionState;
  }

  /**
   * Step 1 & 2: User expresses explicit Feature Intent (e.g., clicks "Start Interview" or "Speak")
   * Returns true if permission is ALREADY granted and verified so the caller can start immediately
   * without showing the pre-flight modal.
   */
  public async initiateFeatureIntent(feature: AudioFeatureContext): Promise<{
    canStartImmediately: boolean;
    permissionState: MicrophonePermissionState;
  }> {
    this.activeFeature = feature;
    this.lifecycleStage = 'feature_intent';
    this.lastError = null;

    const current = await this.checkPassivePermissionState();

    if (current === 'granted') {
      // Acquire or verify stream silently since permission is already granted
      const result = await this.requestBrowserPermission(feature);
      if (result.state === 'granted') {
        this.lifecycleStage = 'session_started';
        this.notify();
        return { canStartImmediately: true, permissionState: 'granted' };
      }
      return { canStartImmediately: false, permissionState: result.state };
    }

    this.lifecycleStage = 'mic_preflight';
    this.notify();
    return { canStartImmediately: false, permissionState: current };
  }

  /**
   * Step 3 & 4: Explicitly request browser microphone permission ONLY when user clicks
   * "Allow Microphone" or "Try Again" inside the contextual AudioPermissionGate.
   */
  public async requestBrowserPermission(feature: AudioFeatureContext): Promise<{
    state: MicrophonePermissionState;
    stream: MediaStream | null;
    errorMessage?: string;
  }> {
    this.activeFeature = feature;
    this.lifecycleStage = 'requesting_browser_permission';
    this.lastError = null;
    this.notify();

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      this.permissionState = 'unavailable';
      this.lastError = 'No microphone input support was detected in this browser or device.';
      this.notify();
      return {
        state: 'unavailable',
        stream: null,
        errorMessage: this.lastError,
      };
    }

    try {
      // Reuse active live stream if tracks are still active
      if (
        this.activeStream &&
        this.activeStream.getAudioTracks().some((t) => t.readyState === 'live')
      ) {
        this.permissionState = 'granted';
        this.sessionGrantedVerified = true;
        this.lifecycleStage = 'mic_ready';
        this.notify();
        return { state: 'granted', stream: this.activeStream };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.activeStream = stream;
      this.permissionState = 'granted';
      this.sessionGrantedVerified = true;
      this.lifecycleStage = 'mic_ready';
      this.lastError = null;
      this.notify();

      return { state: 'granted', stream };
    } catch (err: any) {
      const errName = err?.name || '';
      const errMsg = err?.message || '';

      if (
        errName === 'NotFoundError' ||
        errName === 'DevicesNotFoundError' ||
        errName === 'OverconstrainedError' ||
        errMsg.toLowerCase().includes('not found') ||
        errMsg.toLowerCase().includes('device')
      ) {
        this.permissionState = 'unavailable';
        this.lastError = 'No working microphone device was detected on your computer.';
      } else if (
        errName === 'NotAllowedError' ||
        errName === 'PermissionDeniedError' ||
        errName === 'SecurityError'
      ) {
        this.permissionState = 'denied';
        this.sessionGrantedVerified = false;
        this.lastError = 'Microphone permission was not granted by the browser.';
      } else {
        this.permissionState = 'unavailable';
        this.lastError = 'Microphone hardware could not be initialized.';
      }

      this.releaseStream();
      this.notify();
      return {
        state: this.permissionState,
        stream: null,
        errorMessage: this.lastError || undefined,
      };
    }
  }

  /**
   * Step 5: Transition from Microphone Ready -> Session Started
   */
  public markSessionStarted(feature: AudioFeatureContext, nonVoiceFallback = false): void {
    this.activeFeature = feature;
    this.lifecycleStage = nonVoiceFallback ? 'non_voice_fallback' : 'session_started';
    this.notify();
  }

  /**
   * Cancel pre-flight ("Not Now") without starting session
   */
  public cancelPreflight(): void {
    this.lifecycleStage = 'idle';
    this.activeFeature = null;
    this.notify();
  }

  /**
   * Release active microphone stream tracks when voice session pauses or ends
   */
  public releaseStream(): void {
    if (this.activeStream) {
      try {
        this.activeStream.getTracks().forEach((track) => track.stop());
      } catch {
        // ignore
      }
      this.activeStream = null;
    }
    if (this.lifecycleStage === 'session_started' || this.lifecycleStage === 'mic_ready') {
      this.lifecycleStage = 'idle';
    }
    this.notify();
  }

  public getSnapshot(): AudioPermissionSnapshot {
    return {
      permissionState: this.permissionState,
      lifecycleStage: this.lifecycleStage,
      activeFeature: this.activeFeature,
      hasActiveStream: Boolean(
        this.activeStream &&
          this.activeStream.getAudioTracks().some((t) => t.readyState === 'live')
      ),
      lastError: this.lastError,
    };
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const snap = this.getSnapshot();
    this.listeners.forEach((fn) => fn(snap));
  }
}

export const AudioPermissionService = new AudioPermissionServiceImpl();
