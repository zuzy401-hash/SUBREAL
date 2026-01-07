
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality, Blob, LiveServerMessage } from '@google/genai';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const toggleAssistant = async () => {
    if (isActive) {
      sessionRef.current?.close();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setIsActive(false);
      return;
    }

    setIsConnecting(true);
    // Initialize GoogleGenAI with the mandatory API_KEY from process.env
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Output Context (24kHz for Gemini output)
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const outputNode = audioContextRef.current.createGain();
    outputNode.connect(audioContextRef.current.destination);
    
    // Input Context (16kHz for Gemini input)
    inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

    let nextStartTime = 0;
    const sources = new Set<AudioBufferSourceNode>();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            // Stream audio from mic to model
            const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // Send input using the resolved session to avoid race conditions
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const audioBuffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
              const source = audioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                sources.delete(source);
              });

              nextStartTime = Math.max(nextStartTime, audioContextRef.current.currentTime);
              source.start(nextStartTime);
              nextStartTime += audioBuffer.duration;
              sources.add(source);
            }

            // Handle model interruption
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sources.values()) {
                source.stop();
              }
              sources.clear();
              nextStartTime = 0;
            }
          },
          onerror: (e) => {
            console.error("Error en asistente:", e);
            setIsActive(false);
          },
          onclose: () => setIsActive(false),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: 'Eres el Guía de SUBREAL. Responde con voz mística y calmada. Ayudas a arquitectos y coleccionistas en el intercambio de visiones y activos.',
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <button 
        onClick={toggleAssistant}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${isActive ? 'bg-yellow-500 scale-110 shadow-[0_0_30px_rgba(234,179,8,0.5)]' : 'bg-black border border-yellow-600/50 hover:bg-yellow-600/10'}`}
      >
        {isConnecting ? (
          <div className="animate-spin w-6 h-6 border-2 border-yellow-600 border-t-transparent rounded-full" />
        ) : (
          <div className={`w-8 h-8 ${isActive ? 'text-black' : 'text-yellow-600'}`}>
             <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
          </div>
        )}
      </button>
      {isActive && (
        <div className="absolute bottom-20 right-0 bg-black/95 border border-yellow-600/30 p-4 rounded-lg w-72 backdrop-blur-xl animate-in slide-in-from-bottom-4 shadow-2xl">
           <div className="flex items-center gap-2 mb-2">
             <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
             <p className="text-[10px] uppercase tracking-widest text-yellow-600 font-bold">Guía SUBREAL Conectado</p>
           </div>
           <p className="text-xs text-gray-300 italic leading-relaxed">"Háblame de tus visiones místicas o consulta sobre los arquitectos del vacío."</p>
        </div>
      )}
    </div>
  );
};

export default LiveAssistant;
