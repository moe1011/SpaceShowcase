// src/hooks/useAudioLogic.js

import { useState, useRef } from "react";

/**
 * A custom hook that handles:
 * - Audio playback (creating an <Audio> instance)
 * - Web Audio API (AudioContext + AnalyserNode)
 * - Volume-based "isSpeaking" detection
 * - Start/stop/pause logic
 */
export default function useAudioLogic() {
  // States that describe audio + puppet
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Whether puppet has started talking at least once (to slide in)
  const [hasExpertStarted, setHasExpertStarted] = useState(false);

  // Refs for audio + Web Audio API
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);

  /**
   * Main method to start playback from a given URL,
   * hook it up to an AnalyserNode for volume detection,
   * and set up event listeners for playing/pausing/ending.
   */
  function playAudio(url) {
    stopAudio(); // in case something was already playing

    const newAudio = new Audio(url);
    audioRef.current = newAudio;

    // Create new AudioContext + analyser
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContextRef.current = audioContext;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // smaller => more frequent data updates
    analyserRef.current = analyser;

    // Connect audio -> analyser -> destination
    const source = audioContext.createMediaElementSource(newAudio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    // Array to store frequency data
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    dataArrayRef.current = dataArray;

    // Event listeners
    newAudio.onplay = () => {
      setIsAudioPlaying(true);
      setHasExpertStarted(true);
      monitorAudioVolume(); // Start monitoring volume
    };
    newAudio.onpause = () => {
      setIsAudioPlaying(false);
      setIsSpeaking(false);
    };
    newAudio.onended = () => {
      setIsAudioPlaying(false);
      setIsSpeaking(false);
    };

    // Start playing
    newAudio.play().catch((err) => {
      console.error("Audio playback error:", err);
    });
  }

  /**
   * Continuously measure volume via requestAnimationFrame.
   * If volume > threshold, set isSpeaking=true; else false.
   */
  function monitorAudioVolume() {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const checkVolume = () => {
      // If there's no analyser or the audio is paused/ended, stop talking + stop loop
      if (
        !analyserRef.current ||
        !dataArrayRef.current ||
        !audioRef.current ||
        audioRef.current.paused ||
        audioRef.current.ended
      ) {
        setIsSpeaking(false);
        return; // stop calling checkVolume
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const volume = dataArrayRef.current.reduce((sum, val) => sum + val, 0);

      // Adjust the threshold to taste
      setIsSpeaking(volume > 1500);

      // Keep looping while audio is playing
      requestAnimationFrame(checkVolume);
    };

    checkVolume();
  }

  /**
   * Immediately stops any playing audio, closes the audio context,
   * and resets isSpeaking/isAudioPlaying.
   */
  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsAudioPlaying(false);
    setIsSpeaking(false);
  }

  /**
   * Resets the puppet visibility. Call this anytime you want to hide the puppet.
   */
  function resetPuppet() {
    setHasExpertStarted(false);
    setIsSpeaking(false);
    setIsAudioPlaying(false);
  }

  /**
   * Toggles between pause and play if there's an audioRef.
   */
  function togglePlayPause() {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback error:", err);
      });
    }
  }

  // Expose our states and methods
  return {
    isAudioPlaying,
    isSpeaking,
    hasExpertStarted,
    playAudio,
    stopAudio,
    togglePlayPause,
    resetPuppet,
  };
}