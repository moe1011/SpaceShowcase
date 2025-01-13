import { useState, useEffect, useRef } from "react";

function NasaImage() {
  const [imageData, setImageData] = useState(null); // Store NASA image data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const isFirstRun = useRef(true); // Track first render to avoid duplicate API calls

  const fetchRandomImage = async (retryCount = 3) => {
    if (retryCount === 3) setLoading(true); // Only set loading true on the first attempt
    setError(null); // Clear any previous errors

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
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retrying
          return fetchRandomImage(retryCount - 1); // Retry the request
        }
        throw new Error(errorData.error?.message || "Failed to fetch image");
      }

      const data = await response.json();
      setImageData(data); // Store the image data
      setError(null); // Clear error on success
    } catch (err) {
      console.error("Error fetching image:", err);
      setError(err.message || "Failed to fetch image. Please try again.");
    } finally {
      if (retryCount === 3) setLoading(false); // Only stop loading on the first attempt
    }
  };

  // eslint-disable-next-line react/prop-types
  function MediaComponent({ mediaType, url, title }) {
    if (mediaType === "image") {
      return (
        <div className="">
          <img
            className=" sm:max-h-[500px] hover:scale-105 duration-500 hover:cursor-pointer hover:shadow-2xl shadow-lg border-3"
            src={url}
            alt={title}
            onClick={() => window.open(url, "_blank")} // Open in new tab
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

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false; // Mark first render as complete
      fetchRandomImage(); // Fetch the first image on load
    }
  }, []);

  const getRandomDate = (startDate, endDate) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const randomTime = start + Math.random() * (end - start);
    return new Date(randomTime).toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  return (
    <div className="NasaImage text-white">
      <h1 className="text-2xl text-center sm:text-left">The Space Showcase</h1>
      <button
        onClick={() => fetchRandomImage()}
        disabled={loading}
        className="bg-green-300 text-black w-24 h-14 rounded-xl fixed bottom-10 inset-x-0 mx-auto sm:inset-auto sm:bottom-auto sm:right-10 sm:top-10
      duration-200 hover:cursor-pointer hover:bg-green-400 active:bg-green-500 text-lg z-50"
      >
        {loading ? "Loading..." : "Next Image"}
      </button>
      {/* {loading && <p>Loading...</p>} */}
      {error && !imageData && <p style={{ color: "red" }}>Error: {error}</p>}
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
