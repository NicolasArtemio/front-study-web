import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const [duration, setDuration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isBase64 = src.startsWith("data:") || src.startsWith("base64:");
  const audioSrc = isBase64 ? src : src;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(formatDuration(audio.duration));
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("error", handleError);
    };
  }, [audioSrc]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!src) return null;

  return (
    <div className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
      <audio
        ref={audioRef}
        src={audioSrc}
        controls
        preload="metadata"
        className="h-8 w-40"
      />
      {isLoading ? (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Cargando...
        </span>
      ) : duration ? (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {duration}
        </span>
      ) : null}
    </div>
  );
};

export default AudioPlayer;
