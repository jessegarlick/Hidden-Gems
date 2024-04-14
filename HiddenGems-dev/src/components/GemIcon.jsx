import React from "react";
import "../CSS/RatingBar.css";

const GemIcon = ({ rating, enjoyRating, onClick}) => {
  const fillPercentage = `${rating}%`;

  const gradientId = `gemFillGradient-${Math.random().toString(16).slice(2)}`;

  return (
   <>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 16 16"
      className="gem-icon"
      onClick={onClick} 

    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset={fillPercentage} />
          <stop offset={fillPercentage} />
        </linearGradient>
      </defs>

      <path
        fill={`url(#${gradientId})`}
        d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6zm11.386 3.785-1.806-2.41-.776 2.413zm-3.633.004.961-2.989H4.186l.963 2.995zM5.47 5.495 L8 13.366l2.532-7.876zm-1.371-.999-.78-2.422-1.818 2.425zM1.499 5.5l5.113 6.817-2.192-6.82zm7.889 6.817 5.123-6.83-2.928.002z"
      />
    </svg>
    </>
  );
};

export default GemIcon;
