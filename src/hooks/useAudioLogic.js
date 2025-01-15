import { useState, useRef } from "react";

export default function useAudioLogic() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  /**
   * Ensure the audio context is unlocked and resumed (especially for iOS).
   */
  const unlockAudioContext = () => {
    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current
        .resume()
        .catch((err) => console.error("Failed to unlock audio context:", err));
    }
  };

  /**
   * Play or resume audio from the given URL.
   * Ensure analyser and source nodes are reconnected.
   */
  function playAudio(url) {
    unlockAudioContext();
  
    // If audio already loaded for this URL, just resume
    if (audioRef.current && audioRef.current.src === url) {
      audioContextRef.current
        ?.resume()
        .then(() => {
          audioRef.current.play().catch(console.error);
          monitorAudioVolume();
          setIsAudioPlaying(true);
        })
        .catch((err) => console.error("Failed to resume audio context:", err));
      return;
    }
  
    stopAudio(); // Stop and clean up any previous audio
  
    const newAudio = new Audio(url);
    audioRef.current = newAudio;
  
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  
    // Create or reconnect analyser
    if (!analyserRef.current) {
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256; // Smaller = faster updates
      analyserRef.current = analyser;
  
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }
  
    // Always reconnect media element source
    const source = audioContextRef.current.createMediaElementSource(newAudio);
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);
  
    newAudio.onplay = () => {
      setIsAudioPlaying(true);
      monitorAudioVolume();
    };
  
    newAudio.onpause = () => {
      setIsAudioPlaying(false);
      setIsSpeaking(false);
    };
  
    newAudio.onended = () => {
      setIsAudioPlaying(false);
      setIsSpeaking(false);
    };
  
    // Ensure AudioContext is resumed before starting playback
    audioContextRef.current
      ?.resume()
      .then(() => {
        newAudio.play().catch(console.error); // Trigger autoplay here
      })
      .catch((err) => console.error("Failed to resume audio context:", err));
  }

  /**
   * Continuously monitor audio volume using requestAnimationFrame.
   */
  function monitorAudioVolume() {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const checkVolume = () => {
      if (!audioRef.current || audioRef.current.paused || audioRef.current.ended) {
        console.log("Audio paused or ended. Stopping volume monitoring.");
        setIsSpeaking(false);
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const volume = dataArrayRef.current.reduce((sum, val) => sum + val, 0);

      // Debug: Log volume to the console
      // console.log("Volume:", volume);

      setIsSpeaking(volume > 3500); // Set threshold

      requestAnimationFrame(checkVolume);
    };

    requestAnimationFrame(checkVolume);
  }

  /**
   * Stop and clean up audio playback.
   */
  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    // Don't close the audio context; it may be reused
    setIsAudioPlaying(false);
    setIsSpeaking(false);
  }

  /**
   * Toggle between play and pause for the current audio.
   */
  function togglePlayPause() {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      playAudio(audioRef.current.src);
    }
  }

  return {
    isAudioPlaying,
    setIsAudioPlaying,
    isSpeaking,
    setIsSpeaking,
    playAudio,
    stopAudio,
    togglePlayPause,
  };
}