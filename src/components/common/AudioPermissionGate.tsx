import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  ShieldCheck,
  AlertCircle,
  X,
  RefreshCw,
  MessageSquare,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import {
  AudioFeatureContext,
  AudioPermissionService,
  MicrophonePermissionState,
} from '../../services/audioPermissionService';

interface AudioPermissionGateProps {
  isOpen: boolean;
  feature: AudioFeatureContext;
  subFeatureLabel?: string;
  onClose: () => void;
  onMicrophoneReady: (stream: MediaStream | null) => void;
  onContinueWithoutMicrophone?: () => void;
}

export const AudioPermissionGate: React.FC<AudioPermissionGateProps> = ({
  isOpen,
  feature,
  subFeatureLabel,
  onClose,
  onMicrophoneReady,
  onContinueWithoutMicrophone,
}) => {
  const [permissionState, setPermissionState] = useState<MicrophonePermissionState>(() =>
    AudioPermissionService.getSnapshot().permissionState
  );
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    AudioPermissionService.checkPassivePermissionState().then((state) => {
      if (!mounted) return;
      setPermissionState(state);
    });
    const unsubscribe = AudioPermissionService.subscribe((snap) => {
      if (!mounted) return;
      setPermissionState(snap.permissionState);
      setErrorDetail(snap.lastError);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isLiveInterview = feature === 'live_interview';

  const preflightTitle = isLiveInterview
    ? 'Microphone needed for Live Interview'
    : 'Microphone needed for Business English Practice';

  const preflightDescription = isLiveInterview
    ? 'CareerOS uses your microphone only during active interview practice to capture your spoken response and generate real-time interview guidance.'
    : 'Enable microphone access to practice spoken responses, pronunciation, and real-time communication feedback.';

  const handleAllowOrRetry = async () => {
    setIsRequesting(true);
    setErrorDetail(null);

    const result = await AudioPermissionService.requestBrowserPermission(feature);
    setIsRequesting(false);
    setPermissionState(result.state);

    if (result.state === 'granted') {
      AudioPermissionService.markSessionStarted(feature, false);
      onMicrophoneReady(result.stream);
    } else if (result.errorMessage) {
      setErrorDetail(result.errorMessage);
    }
  };

  const handleNotNow = () => {
    AudioPermissionService.cancelPreflight();
    onClose();
  };

  const handleContinueNonVoice = () => {
    AudioPermissionService.markSessionStarted(feature, true);
    if (onContinueWithoutMicrophone) {
      onContinueWithoutMicrophone();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-permission-gate-title"
    >
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Accent Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {permissionState === 'denied' ? (
              <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <MicOff className="w-5 h-5" />
              </div>
            ) : permissionState === 'unavailable' ? (
              <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
            ) : (
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                  isLiveInterview
                    ? 'bg-purple-50 border-purple-200 text-purple-600'
                    : 'bg-blue-50 border-blue-200 text-blue-600'
                }`}
              >
                <Mic className="w-5 h-5" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    permissionState === 'denied'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : permissionState === 'unavailable'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : isLiveInterview
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  {permissionState === 'denied'
                    ? 'Permission Blocked'
                    : permissionState === 'unavailable'
                      ? 'Device Unavailable'
                      : subFeatureLabel || (isLiveInterview ? 'Live Interview' : 'Voice Practice')}
                </span>
              </div>

              <h3
                id="audio-permission-gate-title"
                className="text-base font-black text-slate-900 mt-1 leading-snug"
              >
                {permissionState === 'denied'
                  ? 'Microphone access is currently blocked'
                  : permissionState === 'unavailable'
                    ? 'No microphone detected on this device'
                    : preflightTitle}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNotNow}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="px-6 pb-5 space-y-4">
          {permissionState === 'denied' ? (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To use Live Interview or spoken Business English practice, enable microphone access
                in your browser settings and try again.
              </p>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>How to enable in your browser:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-0.5">
                  <li>
                    Click the <strong>lock</strong> or <strong>site settings</strong> icon in your
                    browser address bar.
                  </li>
                  <li>
                    Set <strong>Microphone</strong> permission to <strong>Allow</strong>.
                  </li>
                  <li>
                    Click <strong>Try Again</strong> below to start your session.
                  </li>
                </ol>
              </div>
            </div>
          ) : permissionState === 'unavailable' ? (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {errorDetail ||
                  'CareerOS could not find an active audio input device. Please connect a microphone or headset and try again, or continue in non-voice mode.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {preflightDescription}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Audio is only active while your session is running and stops automatically when
                  you pause or exit.
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2">
            {permissionState === 'denied' || permissionState === 'unavailable' ? (
              <>
                <button
                  type="button"
                  onClick={handleAllowOrRetry}
                  disabled={isRequesting}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold text-white transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 ${
                    isLiveInterview
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRequesting ? 'animate-spin' : ''}`} />
                  <span>{isRequesting ? 'Checking Microphone...' : 'Try Again'}</span>
                </button>

                {onContinueWithoutMicrophone && (
                  <button
                    type="button"
                    onClick={handleContinueNonVoice}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                    <span>Continue Without Microphone</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleNotNow}
                  className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Not Now
                </button>
              </>
            ) : (
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleNotNow}
                  disabled={isRequesting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Not Now
                </button>

                <button
                  type="button"
                  onClick={handleAllowOrRetry}
                  disabled={isRequesting}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-60 ${
                    isLiveInterview
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isRequesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Requesting Access...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Allow Microphone</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
