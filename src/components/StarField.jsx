import { useState, useEffect } from 'react';

const StarField = () => {
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  const [constellations, setConstellations] = useState([]);

  useEffect(() => {
    // Generate regular twinkling stars
    const generateStars = () => {
      const starArray = [];
      const starCount = 150; // Number of stars
      
      for (let i = 0; i < starCount; i++) {
        const star = {
          id: i,
          x: Math.random() * 100, // Percentage
          y: Math.random() * 100, // Percentage
          size: ['small', 'medium', 'large', 'bright'][Math.floor(Math.random() * 4)],
          delay: Math.random() * 5, // Animation delay
        };
        starArray.push(star);
      }
      setStars(starArray);
    };

    // Generate shooting stars
    const generateShootingStars = () => {
      const shootingStarArray = [];
      const shootingStarCount = 3;
      
      for (let i = 0; i < shootingStarCount; i++) {
        const shootingStar = {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 8,
        };
        shootingStarArray.push(shootingStar);
      }
      setShootingStars(shootingStarArray);
    };

    // Generate constellation stars
    const generateConstellations = () => {
      const constellationArray = [];
      const constellationCount = 20;
      
      for (let i = 0; i < constellationCount; i++) {
        const constellation = {
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 4,
        };
        constellationArray.push(constellation);
      }
      setConstellations(constellationArray);
    };

    generateStars();
    generateShootingStars();
    generateConstellations();
  }, []);

  return (
    <div className="star-field">
      {/* Regular twinkling stars */}
      {stars.map((star) => (
        <div
          key={`star-${star.id}`}
          className={`star ${star.size}`}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((shootingStar) => (
        <div
          key={`shooting-${shootingStar.id}`}
          className="shooting-star"
          style={{
            left: `${shootingStar.x}%`,
            top: `${shootingStar.y}%`,
            animationDelay: `${shootingStar.delay}s`,
          }}
        />
      ))}

      {/* Constellation stars */}
      {constellations.map((constellation) => (
        <div
          key={`constellation-${constellation.id}`}
          className="constellation"
          style={{
            left: `${constellation.x}%`,
            top: `${constellation.y}%`,
            animationDelay: `${constellation.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default StarField; 