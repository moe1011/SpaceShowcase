/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";

function NasaImage() {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Holds the local audio URL (blob) for the *current* image
  const [expertAudioUrl, setExpertAudioUrl] = useState(null);

  // Tracks whether audio is currently playing (for showing Pause/Play)
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Tracks whether the expert audio **has started** at least once
  // (controls whether the play/pause button is even shown)
  const [hasExpertStarted, setHasExpertStarted] = useState(false);

  // Reference to the actual Audio object
  const audioRef = useRef(null);

  // On mount, fetch a random NASA image
  useEffect(() => {
    fetchRandomImage();
  }, []);

  /**
   * Fetches a random NASA image from the /api/nasa route
   * Resets audio / UI states for the new image
   */
  const fetchRandomImage = async (retryCount = 3) => {
    stopCurrentAudio();
    // Reset any existing audio state so we do a fresh call if user wants TTS again
    setExpertAudioUrl(null);
    setIsAudioPlaying(false);
    setHasExpertStarted(false);

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
      setError(null);
    } catch (err) {
      console.error("Error fetching image:", err);
      setError(err.message || "Failed to fetch image. Please try again.");
    } finally {
      if (retryCount === 3) setLoading(false);
    }
  };

  /**
   * If we already have an expertAudioUrl, just replay it.
   * Otherwise, rewrite the NASA explanation via GPT-4o and get new TTS audio.
   */
  const handleRewriteAndTTS = async () => {
    if (!imageData) return;

    // If we already generated audio for this image, just replay
    if (expertAudioUrl) {
      playAudio(expertAudioUrl);
      return;
    }

    // Otherwise, call the rewrite and TTS APIs
    stopCurrentAudio(); // ensure no overlap

    try {
      // Step 1: Rewrite
      const rewriteResp = await fetch("/api/rewriteExplanation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ explanation: imageData.explanation }),
      });

      if (!rewriteResp.ok) {
        throw new Error("Failed to rewrite the explanation");
      }

      const { newExplanation } = await rewriteResp.json();

      // Step 2: Combine text for TTS
      const finalText = `Hello, I'm your excited cosmic scientist. 
        Here's the photo titled "${imageData.title}". 
        ${newExplanation}`;

      // Step 3: TTS
      const ttsResponse = await fetch("/api/generateTTS", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: finalText }),
      });

      if (!ttsResponse.ok) {
        throw new Error("Failed to generate TTS audio");
      }

      // Step 4: Convert response to blob -> URL
      const audioBlob = await ttsResponse.blob();
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setExpertAudioUrl(newAudioUrl);

      // Play the newly generated audio
      playAudio(newAudioUrl);
    } catch (err) {
      console.error("Error in rewrite or TTS:", err.message);
    }
  };

  /**
   * Plays the audio from a given URL.
   * Sets up event listeners to track play/pause/end so we can update the UI.
   */
  const playAudio = (url) => {
    stopCurrentAudio(); // stop if something else is playing

    const newAudio = new Audio(url);
    audioRef.current = newAudio;

    // Update state upon playback changes
    newAudio.onplay = () => {
      setIsAudioPlaying(true);
      setHasExpertStarted(true); // "Expert" audio is now actually heard
    };
    newAudio.onpause = () => setIsAudioPlaying(false);
    newAudio.onended = () => setIsAudioPlaying(false);

    // Attempt to play
    newAudio.play().catch((err) => {
      console.error("Audio playback error:", err);
    });
  };

  /**
   * Pauses or resumes the current audio, depending on its state.
   */
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.error("Audio playback error:", err);
      });
    }
  };

  /**
   * Immediately stops the currently playing audio
   */
  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // reset to beginning
      audioRef.current = null;
    }
    setIsAudioPlaying(false);
  };

  /**
   * Generates a random date between startDate and endDate
   */
  const getRandomDate = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime).toISOString().split("T")[0];
  };

  // Renders image or video
  function MediaComponent({ mediaType, url, title }) {
    if (mediaType === "image") {
      return (
        <div>
          <img
            className="sm:max-h-[500px] hover:scale-105 duration-500 hover:cursor-pointer hover:shadow-2xl shadow-lg border-3"
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
            className="w-[1000px] h-[500px]"
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
    <div className="NasaImage text-white">
      <h1 className="text-2xl text-center sm:text-left">The Space Showcase</h1>

      {/* Fetch next random NASA image */}
      <button
        onClick={fetchRandomImage}
        disabled={loading}
        className="bg-green-300 text-black w-24 h-14 rounded-xl fixed bottom-10 inset-x-0 mx-auto sm:inset-auto sm:bottom-auto sm:right-10 sm:top-10
      duration-200 hover:cursor-pointer hover:bg-green-400 active:bg-green-500 text-lg z-50"
      >
        {loading ? "Loading..." : "Next Image"}
      </button>

      {/* Button to generate or replay TTS explanation for the current image */}
      {imageData && (
        <button
          onClick={handleRewriteAndTTS}
          className="bg-blue-300 text-black w-40 h-10 rounded-xl
            duration-200 hover:cursor-pointer hover:bg-blue-400 active:bg-blue-500 text-md z-50 mt-4"
        >
          Expert Explanation
        </button>
      )}

      {/* Show Play/Pause button ONLY after the audio has started at least once */}
      {hasExpertStarted && (
        <button
          onClick={togglePlayPause}
          className="bg-gray-300 text-black w-24 h-10 rounded-xl ml-2
            duration-200 hover:cursor-pointer hover:bg-gray-400 active:bg-gray-500 text-md z-50 mt-4"
        >
          {isAudioPlaying ? "Pause" : "Play"}
        </button>
      )}

      {/* Error Display */}
      {error && !imageData && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* NASA image display */}
      {imageData && (
        <div className="flex flex-col w-full h-full items-center justify-center pt-5">
          <h2 className="text-3xl text-center">{imageData.title}</h2>
          <p className="text-lg text-center">{imageData.date}</p>
          <div className="py-7 w-fit h-fit">
            <MediaComponent
              mediaType={imageData.media_type}
              url={imageData.url}
              title={imageData.title}
            />
          </div>
          <p className="text-xl">{imageData.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default NasaImage;