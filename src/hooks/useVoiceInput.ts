import { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  error: string;
}

export function useVoiceInput() {
  const [state, setState] = useState<VoiceState>({
    isSupported: false,
    isListening: false,
    transcript: '',
    error: '',
  });

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setState((s) => ({ ...s, isSupported: true }));

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setState((s) => ({ ...s, transcript: text, isListening: false }));
    };

    recognition.onerror = (event: any) => {
      setState((s) => ({ ...s, isListening: false, error: event.error }));
    };

    recognition.onend = () => {
      setState((s) => ({ ...s, isListening: false }));
    };

    return () => {
      try { recognition.abort(); } catch {}
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) {
      setState((s) => ({ ...s, error: '浏览器不支持语音识别' }));
      return;
    }
    setState((s) => ({ ...s, transcript: '', error: '', isListening: true }));
    try {
      recognitionRef.current.start();
    } catch {
      // Already started
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {}
    setState((s) => ({ ...s, isListening: false }));
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({ ...s, transcript: '', error: '' }));
  }, []);

  return { ...state, start, stop, reset };
}
