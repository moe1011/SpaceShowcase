import axios from "axios";

export default async function handler(req, res) {
  let { date } = req.query;

  if (date) {
    date = date.trim().replace(/[^0-9\-]/g, ""); // Sanitize date
  }

  const NASA_API_KEY = process.env.NASA_API_KEY;

  try {
    const response = await axios.get("https://api.nasa.gov/planetary/apod", {
      params: { api_key: NASA_API_KEY, date },
    });

    // Log the rate limit headers
    console.log("X-RateLimit-Limit:", response.headers["x-ratelimit-limit"]);
    console.log("X-RateLimit-Remaining:", response.headers["x-ratelimit-remaining"]);
    console.log("X-RateLimit-Reset:", response.headers["x-ratelimit-reset"]);

    res.status(200).json({
      ...response.data,
      rateLimit: {
        limit: response.headers["x-ratelimit-limit"],
        remaining: response.headers["x-ratelimit-remaining"],
        reset: response.headers["x-ratelimit-reset"],
      },
    });
  } catch (error) {
    console.error("Error fetching NASA data:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch NASA data" });
  }
}