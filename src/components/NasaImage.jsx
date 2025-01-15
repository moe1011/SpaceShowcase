// src/components/NasaImage.jsx

import { useState, useEffect } from "react";
import ExpertPuppet from "./ExpertPuppet";
import useAudioLogic from "../hooks/useAudioLogic";
import {
  TbMoodSpark,
  TbLoader2,
  TbPlayerPlay,
  TbPlayerPause,
  TbPlayerTrackNext,
  TbRefreshAlert,
} from "react-icons/tb";

function NasaImage() {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TTS audio for this image
  const [expertAudioUrl, setExpertAudioUrl] = useState(null);

  // Is TTS loading?
  const [ttsLoading, setTtsLoading] = useState(false);

  // Whether puppet is visible (slides in)
  const [hasExpertStarted, setHasExpertStarted] = useState(false);

  // Audio logic
  const {
    isAudioPlaying,
    setIsAudioPlaying,
    isSpeaking,
    setIsSpeaking,
    playAudio,
    stopAudio,
    togglePlayPause,
  } = useAudioLogic();

  useEffect(() => {
    fetchRandomImage();
    return () => {
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Grab a random NASA image
   */
  const fetchRandomImage = async (retryCount = 3) => {
    // Reset states
    setHasExpertStarted(false);
    setIsSpeaking(false);
    setIsAudioPlaying(false);
    stopAudio();
    setExpertAudioUrl(null);
    setLoading(true);
    setError(null);

    const randomDate = getRandomDate(
      "1995-06-16",
      new Date().toISOString().split("T")[0]
    );

    try {
      const response = await fetch(`/api/nasa?date=${randomDate}`);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.code === "OVER_RATE_LIMIT" && retryCount > 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return fetchRandomImage(retryCount - 1);
        }
        throw new Error(errorData.error?.message || "Failed to fetch image");
      }

      const data = await response.json();
      setImageData(data);
    } catch (err) {
      setError(err.message || "Failed to fetch image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Expert Explanation button
   */
  const handleRewriteAndTTS = async () => {
    if (!imageData) return;

    if (expertAudioUrl) {
      startPuppetAndPlay(expertAudioUrl);
      return;
    }

    stopAudio();
    setTtsLoading(true);

    try {
      // Rewrite explanation
      const rewriteResp = await fetch("/api/rewriteExplanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ explanation: imageData.explanation }),
      });
      if (!rewriteResp.ok) {
        throw new Error("Failed to rewrite explanation");
      }
      const { newExplanation } = await rewriteResp.json();

      // Generate TTS
      const ttsResp = await fetch("/api/generateTTS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Hello, I'm your cosmic scientist. Here's the photo titled "${imageData.title}". ${newExplanation}`,
          voice: "nova",
        }),
      });
      if (!ttsResp.ok) {
        throw new Error("Failed to generate TTS audio");
      }

      const audioBlob = await ttsResp.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setExpertAudioUrl(newAudioUrl);

      // Start puppet + audio
      startPuppetAndPlay(newAudioUrl);
      setError(null);
    } catch (err) {
      setError(err.message || "Error generating TTS explanation.");
      console.error(err);
    } finally {
      setTtsLoading(false);
    }
  };

  // Start puppet and audio in one step
  function startPuppetAndPlay(url) {
    setHasExpertStarted(true);
    playAudio(url);
  }

  function getRandomDate(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime).toISOString().split("T")[0];
  }

  // Debug: see if isSpeaking changes
  //   useEffect(() => {
  //     console.log("isSpeaking changed:", isSpeaking);
  //   }, [isSpeaking]);

  return (
    <div className="NasaImage text-white relative">
      <h1 className="text-2xl text-center sm:text-left">The Space Showcase</h1>

      {/* Next Image Button */}
      <button
        onClick={fetchRandomImage}
        disabled={loading}
        className="group bg-green-300 text-black w-24 h-14 rounded-xl 
                   fixed bottom-10 inset-x-0 mx-auto flex items-center 
                   justify-center text-4xl sm:inset-auto sm:bottom-auto 
                   sm:right-10 sm:top-10 duration-200 hover:cursor-pointer 
                   sm:hover:bg-green-400 sm:active:bg-green-500 z-50"
      >
        <div className={loading ? "animate-spin" : ""}>
          <div className="sm:group-hover:text-[2.7rem] duration-300 ease-in-out">
            {loading ? <TbLoader2 /> : <TbPlayerTrackNext />}
          </div>
        </div>
      </button>

      {/* Expert Explanation Button */}
      {imageData && (
        <button
          onClick={handleRewriteAndTTS}
          disabled={ttsLoading || loading}
          className={`group z-50 bg-blue-300 text-black w-24 h-14 
                      fixed bottom-10 left-5 sm:top-28 sm:right-10 
                      sm:left-auto rounded-xl text-4xl flex items-center
                      justify-center duration-200 hover:cursor-pointer 
                      sm:hover:bg-blue-400 sm:active:bg-blue-500 text-md 
                      mt-4 ml-2 ${!ttsLoading ? " animate-rainbow-ring" : ""}`}
        >
          <div className={ttsLoading ? "animate-spin" : ""}>
            <div className="sm:group-hover:rotate-12 duration-300 ease-in-out">
              {!error ? (
                ttsLoading ? (
                  <TbLoader2 />
                ) : (
                  <TbMoodSpark />
                )
              ) : (
                <TbRefreshAlert />
              )}
            </div>
          </div>
        </button>
      )}

      {/* Play/Pause Button if puppet is visible */}
      {hasExpertStarted && (
        <button
          onClick={togglePlayPause}
          className="bg-gray-300 text-black w-14 h-14 rounded-full ml-2 
                     fixed bottom-28 left-9 sm:top-28 sm:right-40 
                     sm:left-auto flex items-center justify-center text-3xl 
                     duration-200 hover:cursor-pointer sm:hover:bg-gray-400 
                     sm:active:bg-gray-500 text-md z-50 mt-4"
        >
          {isAudioPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
        </button>
      )}

      {/* Error */}
      {error && !imageData && (
        <p style={{ color: "red" }} className="absolute top-20 left-10">
          Error: {error}
        </p>
      )}

      {/* Show NASA Image/Video if present */}
      {imageData && (
        <div className="flex flex-col w-full h-full items-center justify-center pt-5">
          <h2 className="text-3xl text-center">{imageData.title}</h2>
          <p className="text-lg text-center">{imageData.date}</p>
          <div className="py-7 w-fit h-fit">
            {imageData.media_type === "image" ? (
              <img
                className="sm:max-h-[500px] hover:scale-105 duration-500 
                           hover:cursor-pointer hover:shadow-2xl shadow-lg 
                           border-[3px]"
                src={imageData.url}
                alt={imageData.title}
                onClick={() => window.open(imageData.url, "_blank")}
              />
            ) : (
              <div className="aspect-video">
                <iframe
                  className="w-[300px] h-[150px] sm:w-[1000px] sm:h-[500px]"
                  src={imageData.url}
                  title={imageData.title}
                  allow="autoplay; encrypted-media"
                  frameBorder="0"
                ></iframe>
              </div>
            )}
          </div>

          {/* Explanation text, shift if puppet is visible */}
          <div className={`${hasExpertStarted ? "sm:pr-[256px]" : ""}`}>
            <p className={`text-xl lg:text-2xl sm:px-20 lg:px-32`}>
              {imageData.explanation}
            </p>
          </div>
        </div>
      )}

      {/* The Puppet! Animates if isSpeaking=true */}
      <ExpertPuppet isVisible={hasExpertStarted} isSpeaking={isSpeaking} />
    </div>
  );
}

export default NasaImage;
