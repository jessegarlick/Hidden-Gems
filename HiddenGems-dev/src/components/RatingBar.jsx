import React from 'react';
import '../CSS/RatingBar.css';
import GemIcon from './GemIcon';
import FireIcon from './FireIcon'; // Make sure to import FireIcon
import axios from 'axios';

const RatingBar = ({ rating, gemId, reload, setReload, type }) => {
  const saveRating = async (i) => {
    setReload(!reload);
    const ratingValue = i * 20;

    // Determine the rating type and send appropriate request
    if (type === "enjoyability") {
      await axios.post("/createRating", { enjoyability: ratingValue, gemId });
      console.log("Changed the enjoyability!");
    } else if (type === "popularity") {
      await axios.post("/createRating", { popularity: ratingValue, gemId });
      console.log("Changed the popularity!");
    }
  };

  const filledRating = rating / 20;

  return (
    <div className="rating-container">
      {Array.from({ length: 5 }).map((_, i) => {
        const fillLevel = Math.max(0, Math.min(100, (filledRating - i) * 100));

        // Conditionally render GemIcon or FireIcon based on type
        return type === "enjoyability" ? (
          <GemIcon key={i} rating={fillLevel} onClick={() => saveRating(i + 1)} />
        ) : (
          <FireIcon key={i} rating={fillLevel} onClick={() => saveRating(i + 1)} />
        );
      })}
      <label style={{borderColor: "#0dcaf0"}}>{rating}</label>
    </div>
  );
};

export default RatingBar;
