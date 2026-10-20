import { detectSpokenLanguageDetails } from '../../realtime/speech/languageDetector';

export type VoiceLanguage = 'vi' | 'en';
export type VoiceGender = 'male' | 'female';

export interface VoiceProfile {
  id: string;
  name: string;
  displayName: string;
  language: VoiceLanguage;
  gender: VoiceGender;
  speakingRate: number;
  pitch: number;
  description: string;
  preferredVoiceNames: string[];
}

/**
 * Production-ready voice configuration matrix for professional interview simulation.
 * Includes curated configurations for native Vietnamese (male/female) and native English (male/female).
 */
export const PRODUCTION_VOICES: Record<string, VoiceProfile> = {
  // Vietnamese Natural Voices
  'vi-female-natural': {
    id: 'vi-female-natural',
    name: 'vi-female-natural',
    displayName: 'Linh (Vietnamese Female · Senior Lead)',
    language: 'vi',
    gender: 'female',
    speakingRate: 0.94, // Conversational, thoughtful cadence
    pitch: 1.02,
    description: 'Natural, professional Vietnamese female interviewer with native pronunciation and clear pacing.',
    preferredVoiceNames: [
      'Google Tiếng Việt',
      'Microsoft HoaiMy Online (Natural) - Vietnamese (Vietnam)',
      'Microsoft HoaiMy',
      'Linh',
      'Mai',
      'vi-VN-language',
      'vi_VN'
    ]
  },
  'vi-male-natural': {
    id: 'vi-male-natural',
    name: 'vi-male-natural',
    displayName: 'Nam (Vietnamese Male · Tech Lead)',
    language: 'vi',
    gender: 'male',
    speakingRate: 0.93,
    pitch: 0.96,
    description: 'Professional, articulate Vietnamese male interviewer with natural sentence rhythm and realistic pauses.',
    preferredVoiceNames: [
      'Microsoft NamMinh Online (Natural) - Vietnamese (Vietnam)',
      'Microsoft NamMinh',
      'Google Tiếng Việt',
      'Nam',
      'An',
      'vi-VN-male',
      'vi_VN'
    ]
  },

  // English Native Voices
  'en-female-native': {
    id: 'en-female-native',
    name: 'en-female-native',
    displayName: 'Sarah (English Female · Native Lead)',
    language: 'en',
    gender: 'female',
    speakingRate: 0.95,
    pitch: 1.0,
    description: 'Native English female interviewer with conversational inflection, natural pauses, and professional clarity.',
    preferredVoiceNames: [
      'Google US English',
      'Samantha',
      'Microsoft Jenny Online (Natural) - English (United States)',
      'Microsoft Jenny',
      'Karen',
      'Victoria',
      'en-US-Natural'
    ]
  },
  'en-male-native': {
    id: 'en-male-native',
    name: 'en-male-native',
    displayName: 'David (English Male · Native Interviewer)',
    language: 'en',
    gender: 'male',
    speakingRate: 0.94,
    pitch: 0.97,
    description: 'Native English male interviewer with calm, conversational rhythm and authentic interview presence.',
    preferredVoiceNames: [
      'Daniel',
      'Google UK English Male',
      'Microsoft Guy Online (Natural) - English (United States)',
      'Microsoft Ryan Online (Natural) - English (United Kingdom)',
      'Microsoft Guy',
      'Alex',
      'Oliver',
      'en-GB-Natural'
    ]
  }
};

export class VoiceEngine {
  private static activeUtterance: SpeechSynthesisUtterance | null = null;
  private static cachedBrowserVoices: SpeechSynthesisVoice[] = [];

  /**
   * Initialize voice listeners to capture async browser voice loading
   */
  public static init(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      this.cachedBrowserVoices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Detect language and pick the optimal production voice profile for an interviewer
   */
  public static resolveVoiceProfile(
    text: string,
    interviewerName: string = '',
    preferredGender?: VoiceGender
  ): VoiceProfile {
    // 1. Language detection
    const langDetails = detectSpokenLanguageDetails(text);
    const isVietnamese = langDetails.code === 'vi' || /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);

    // 2. Gender determination (default Sarah Chen = female, David Kim = male)
    let gender: VoiceGender = preferredGender || 'female';
    const lowerName = interviewerName.toLowerCase();
    if (lowerName.includes('david') || lowerName.includes('alex') || lowerName.includes('nam') || lowerName.includes('michael') || lowerName.includes('john')) {
      gender = 'male';
    } else if (lowerName.includes('sarah') || lowerName.includes('linh') || lowerName.includes('emily') || lowerName.includes('jessica')) {
      gender = 'female';
    }

    if (isVietnamese) {
      return gender === 'male' ? PRODUCTION_VOICES['vi-male-natural'] : PRODUCTION_VOICES['vi-female-natural'];
    }
    return gender === 'male' ? PRODUCTION_VOICES['en-male-native'] : PRODUCTION_VOICES['en-female-native'];
  }

  /**
   * Find the closest matching native SpeechSynthesisVoice in the client's browser
   */
  private static matchBrowserVoice(profile: VoiceProfile): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (this.cachedBrowserVoices.length === 0) {
      this.cachedBrowserVoices = window.speechSynthesis.getVoices();
    }

    const langPrefix = profile.language === 'vi' ? 'vi' : 'en';

    // 1. Exact preferred name match
    for (const prefName of profile.preferredVoiceNames) {
      const match = this.cachedBrowserVoices.find(v => 
        v.name.toLowerCase().includes(prefName.toLowerCase())
      );
      if (match) return match;
    }

    // 2. Match by language prefix and gender heuristic
    const matchingLangVoices = this.cachedBrowserVoices.filter(v => 
      v.lang.toLowerCase().startsWith(langPrefix)
    );

    if (matchingLangVoices.length > 0) {
      // Look for natural / neural keywords in voice name
      const neuralVoice = matchingLangVoices.find(v => 
        v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online')
      );
      if (neuralVoice) return neuralVoice;
      return matchingLangVoices[0];
    }

    // 3. Fallback to any voice with language prefix
    return this.cachedBrowserVoices.find(v => v.lang.toLowerCase().startsWith(langPrefix)) || null;
  }

  /**
   * Speaks text using calibrated conversational prosody with punctuation-aware pauses
   */
  public static speak(
    text: string,
    options: {
      interviewerName?: string;
      preferredGender?: VoiceGender;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options.onStart?.();
      setTimeout(() => options.onEnd?.(), 3000);
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    const profile = this.resolveVoiceProfile(text, options.interviewerName, options.preferredGender);
    const matchedVoice = this.matchBrowserVoice(profile);

    // Prepare human-like punctuation pauses by adding clean spacing
    const formattedText = text
      .replace(/\s+/g, ' ')
      .replace(/([.?!])\s*/g, '$1 ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(formattedText);
    utterance.rate = profile.speakingRate;
    utterance.pitch = profile.pitch;
    utterance.lang = profile.language === 'vi' ? 'vi-VN' : 'en-US';

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    let hasEnded = false;
    let fallbackTimer: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (fallbackTimer) clearTimeout(fallbackTimer);
      this.activeUtterance = null;
    };

    utterance.onstart = () => {
      this.activeUtterance = utterance;
      options.onStart?.();
    };

    utterance.onend = () => {
      if (!hasEnded) {
        hasEnded = true;
        cleanup();
        options.onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      if (!hasEnded) {
        hasEnded = true;
        cleanup();
        options.onError?.(e);
        options.onEnd?.();
      }
    };

    window.speechSynthesis.speak(utterance);

    // Generous fallback timer based on word count (~150 words per minute + 3s buffer)
    const wordCount = formattedText.split(' ').length;
    const estimatedDurationMs = Math.max(4000, Math.round((wordCount / 2.5) * 1000) + 3000);

    fallbackTimer = setTimeout(() => {
      if (!hasEnded) {
        hasEnded = true;
        cleanup();
        options.onEnd?.();
      }
    }, estimatedDurationMs);
  }

  /**
   * Stop active speech immediately
   */
  public static stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.activeUtterance = null;
    }
  }

  /**
   * Pause speech
   */
  public static pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  /**
   * Resume speech
   */
  public static resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }
}
