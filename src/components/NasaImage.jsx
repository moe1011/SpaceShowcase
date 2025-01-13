import { useState, useEffect, useRef} from "react";

function NasaImage() {
  const [imageData, setImageData] = useState(null); // Store NASA image data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const isFirstRun = useRef(true); // Track first render to avoid duplicate API calls

  const fetchRandomImage = async (retryCount = 3) => {
    if (retryCount === 3) setLoading(true); // Only set loading true on the first attempt
    setError(null); // Clear any previous errors

    const randomDate = getRandomDate("1995-06-16", new Date().toISOString().split("T")[0]);
    console.log("Fetching image for date:", randomDate);

    try {
      const response = await fetch(`/api/nasa?date=${randomDate}`);
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error?.code === "OVER_RATE_LIMIT" && retryCount > 0) {
          console.log(`Rate limit hit. Retrying in 1 second... (${retryCount} retries left)`);
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
    <div className="NasaImage">
      <h1>NASA Image of the Day</h1>
      {loading && <p>Loading...</p>}
      {error && !imageData && <p style={{ color: "red" }}>Error: {error}</p>}
      {imageData && (
        <div>
          <h2>{imageData.title}</h2>
          <p>{imageData.date}</p>
          <img
            src={imageData.url}
            alt={imageData.title}
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <p>{imageData.explanation}</p>
        </div>
      )}
      <button onClick={() => fetchRandomImage()} disabled={loading}>
        {loading ? "Loading..." : "Fetch Another Image"}
      </button>
    </div>
  );
}

export default NasaImage;