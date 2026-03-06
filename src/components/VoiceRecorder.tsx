import { useState, useRef } from "react";

interface VoiceRecorderProps {
  onSave: (audioBase64: string) => void;
  disabled?: boolean;
}

const VoiceRecorder = ({ onSave, disabled = false }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      setError("No se pudo acceder al micrófono. Verifica los permisos.");
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSave = () => {
    if (!audioBlob) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onSave(base64);
      discardRecording();
    };
    reader.readAsDataURL(audioBlob);
  };

  const discardRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
  };

  if (disabled) {
    return (
      <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Grabación de audio no disponible
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {!isRecording && !audioBlob && (
          <button
            type="button"
            onClick={startRecording}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition flex items-center gap-2"
          >
            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
            Grabar
          </button>
        )}

        {isRecording && (
          <button
            type="button"
            onClick={stopRecording}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition flex items-center gap-2"
          >
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            Detener
          </button>
        )}

        {isRecording && (
          <span className="text-red-500 animate-pulse font-medium">
            Grabando...
          </span>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {audioUrl && !isRecording && (
        <div className="space-y-3 p-3 border border-gray-300 dark:border-gray-600 rounded-md">
          <audio
            controls
            src={audioUrl}
            className="w-full"
            preload="metadata"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition"
            >
              Guardar audio
            </button>
            <button
              type="button"
              onClick={discardRecording}
              className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Descartar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
