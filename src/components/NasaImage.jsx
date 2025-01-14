// src/components/NasaImage.jsx

import { useState, useEffect } from "react";
import ExpertPuppet from "./ExpertPuppet";
// Import our new hook
import useAudioLogic from "../hooks/useAudioLogic";
import {
  TbMoodSpark,
  TbLoader2,
  TbPlayerPlay,
  TbPlayerPause,
  TbPlayerTrackNext,
} from "react-icons/tb";

function NasaImage() {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false); // Loading for NASA fetch
  const [error, setError] = useState(null);

  // For storing the final TTS audio URL
  const [expertAudioUrl, setExpertAudioUrl] = useState(null);

  // Whether we’re currently generating TTS
  const [ttsLoading, setTtsLoading] = useState(false);

  // Use our audio logic hook
  const {
    isAudioPlaying,
    isSpeaking,
    hasExpertStarted,
    playAudio,
    stopAudio,
    togglePlayPause,
    resetPuppet,
  } = useAudioLogic();

  // On mount, fetch an image
  useEffect(() => {
    fetchRandomImage();
    // Cleanup on unmount
    return () => {
      stopAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetch a random NASA image from /api/nasa
   * Reset puppet + audio states before new fetch
   */
  const fetchRandomImage = async (retryCount = 3) => {
    stopAudio();
    resetPuppet();
    setExpertAudioUrl(null);
    setLoading(true);

    if (retryCount === 3) setLoading(true);
    setError(null);

    const randomDate = getRandomDate(
      "1995-06-16",
      new Date().toISOString().split("T")[0]
    );
    console.log("Fetching image for date:", randomDate);

    try {
      const response = await fetch(`/api/nasa?date=${randomDate}`);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.code === "OVER_RATE_LIMIT" && retryCount > 0) {
          console.log(
            `Rate limit hit. Retrying in 1 second... (${retryCount} retries left)`
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return fetchRandomImage(retryCount - 1);
        }
        throw new Error(errorData.error?.message || "Failed to fetch image");
      }

      const data = await response.json();
      setImageData(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching image:", err);
      setError(err.message || "Failed to fetch image. Please try again.");
    } finally {
      if (retryCount === 3) setLoading(false);
    }
  };

  /**
   * Called when user clicks "Expert Explanation".
   * If we already have an audio URL, just replay it.
   * Otherwise, rewrite the explanation and get fresh TTS.
   */
  const handleRewriteAndTTS = async () => {
    if (!imageData) return;

    // If we already have TTS for this image, just play it
    if (expertAudioUrl) {
      playAudio(expertAudioUrl);
      return;
    }

    stopAudio(); // ensure no overlap

    try {
      // Show "loading" indicator on Expert button
      setTtsLoading(true);

      // 1) Rewrite
      const rewriteResp = await fetch("/api/rewriteExplanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ explanation: imageData.explanation }),
      });
      if (!rewriteResp.ok) {
        throw new Error("Failed to rewrite the explanation");
      }
      const { newExplanation } = await rewriteResp.json();

      // 2) Prepare final text
      const finalText = `Hello, I'm your cosmic scientist.
         Here's the photo titled "${imageData.title}".
         ${newExplanation}`;

      // 3) TTS
      const ttsResponse = await fetch("/api/generateTTS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: finalText }),
      });
      if (!ttsResponse.ok) {
        throw new Error("Failed to generate TTS audio");
      }

      // Convert to a local URL for <Audio>
      const audioBlob = await ttsResponse.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setExpertAudioUrl(newAudioUrl);

      // Start playback
      playAudio(newAudioUrl);
    } catch (err) {
      console.error("Error in rewrite or TTS:", err.message);
    } finally {
      // Hide "loading" indicator
      setTtsLoading(false);
    }
  };

  /**
   * Utility: Return a random date in the NASA APOD range
   */
  function getRandomDate(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime).toISOString().split("T")[0];
  }

  /**
   * For images vs. videos
   */
  // eslint-disable-next-line react/prop-types
  function MediaComponent({ mediaType, url, title }) {
    if (mediaType === "image") {
      return (
        <div>
          <img
            className="sm:max-h-[500px] hover:scale-105 duration-500 hover:cursor-pointer hover:shadow-2xl shadow-lg border-[3px]"
            src={url}
            alt={title}
            onClick={() => window.open(url, "_blank")}
          />
        </div>
      );
    } else if (mediaType === "video") {
      return (
        <div className="aspect-video">
          <iframe
            className="w-[300px] h-[150px]  sm:w-[1000px] sm:h-[500px]"
            src={url}
            title={title}
            allow="autoplay; encrypted-media"
            frameBorder="0"
          ></iframe>
        </div>
      );
    } else {
      return <p>Unsupported media type</p>;
    }
  }

  return (
    <div className="NasaImage text-white relative">
      <h1 className="text-2xl text-center sm:text-left">The Space Showcase</h1>

      {/* Next Image Button */}
      <button
        onClick={fetchRandomImage}
        disabled={loading}
        className="group bg-green-300 text-black w-24 h-14 rounded-xl fixed bottom-10 inset-x-0 mx-auto 
                    flex items-center justify-center text-4xl
                    sm:inset-auto sm:bottom-auto sm:right-10 sm:top-10 duration-200 
                    hover:cursor-pointer hover:bg-green-400 active:bg-green-500 z-50"
      >
        <div className={loading ? "animate-spin" : ""}>
          <div className="group-hover:text-[2.7rem]  duration-300 ease-in-out">
            {loading ? <TbLoader2 /> : <TbPlayerTrackNext />}
          </div>
        </div>
      </button>

      {/* Expert Explanation Button */}
      {imageData && (
        <button
          onClick={handleRewriteAndTTS}
          disabled={ttsLoading}
          className={`group z-50 bg-blue-300 text-black w-24 h-14 fixed bottom-10 left-5 sm:top-28 sm:right-10 sm:left-auto
              rounded-xl text-4xl flex items-center justify-center
              duration-200 hover:cursor-pointer hover:bg-blue-400 
              active:bg-blue-500 text-md mt-4 ml-2
              ${!ttsLoading ? " animate-rainbow-ring" : ""}
            `}
        >
          <div className={`${ttsLoading ? "animate-spin" : ""}`}>
            <div className="group-hover:rotate-12 duration-300 ease-in-out">
              {ttsLoading ? <TbLoader2 /> : <TbMoodSpark />}
            </div>
          </div>
        </button>
      )}

      {/* Play/Pause Button: only show if we've started at least once */}
      {hasExpertStarted && (
        <button
          onClick={togglePlayPause}
          className="bg-gray-300 text-black w-14 h-14 rounded-full ml-2 fixed bottom-28 left-9 sm:top-28 sm:right-40 sm:left-auto
                    flex items-center justify-center text-3xl
                       duration-200 hover:cursor-pointer hover:bg-gray-400 
                       active:bg-gray-500 text-md z-50 mt-4"
        >
          {isAudioPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
        </button>
      )}

      {/* Error, if any */}
      {error && !imageData && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* 
          Render NASA image or video
          NOTE: we add a conditional margin-right to avoid puppet overlap if it's visible
        */}
      {imageData && (
        <div
          className={`
              flex flex-col w-full h-full items-center justify-center pt-5 transition-all duration-300`}
        >
          <h2 className="text-3xl text-center">{imageData.title}</h2>
          <p className="text-lg text-center">{imageData.date}</p>
          <div className="py-7 w-fit h-fit">
            <MediaComponent
              mediaType={imageData.media_type}
              url={imageData.url}
              title={imageData.title}
            />
          </div>
          <p
            className={`text-xl ${
              hasExpertStarted ? "sm:pr-[256px] duration-500 ease-in-out" : ""
            }`}
          >
            {imageData.explanation}
          </p>
        </div>
      )}

      {/* The Puppet! Slides in when hasExpertStarted=true 
            Bobs if isSpeaking=true (only while volume > threshold) */}
      <ExpertPuppet isVisible={hasExpertStarted} isSpeaking={isSpeaking} />
    </div>
  );
}

export default NasaImage;
