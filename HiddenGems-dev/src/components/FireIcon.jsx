import React from "react";

const FireIcon = ({ rating, onClick }) => {
  const fillPercentage = `${rating}%`;
  const gradientId = `fireFillGradient-${Math.random().toString(16).slice(2)}`;

  return (
    <>
      <svg
        height="40"
        preserveAspectRatio="xMidYMid"
        viewBox="-33 0 255 255"
        width="40"
        xmlns="http://www.w3.org/2000/svg"
        onClick={onClick}
        className="fire-icon"
      >
        <defs>
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0" stopColor="red"/>
            <stop offset={fillPercentage} stopColor="yellow"/>
            <stop offset={fillPercentage} stopColor="black" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <g fillRule="evenodd">
          <path
            fill={`url(#${gradientId})`}
            d="m187.899 164.809c-2.096 50.059-43.325 90.003-93.899 90.003-51.915 0-94-43.5-94-94 0-6.75-.121-20.24 10-43 6.057-13.621 9.856-22.178 12-30 1.178-4.299 3.469-11.129 10 0 3.851 6.562 4 16 4 16s14.328-10.995 24-32c14.179-30.793 2.866-49.2-1-62-1.338-4.428-2.178-12.386 7-9 9.352 3.451 34.076 20.758 47 39 18.445 26.035 25 51 25 51s5.906-7.33 8-15c2.365-8.661 2.4-17.239 9.999-7.999 7.227 8.787 17.96 25.3 24.001 40.999 10.969 28.509 7.899 55.997 7.899 55.997z"
          />
        </g>
      </svg>
    </>
  );
};

export default FireIcon;
