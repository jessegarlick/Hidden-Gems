// TopGems.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/Gems.css";
import RatingBar from "../components/RatingBar.jsx";
import GemCard from "../components/GemCard.jsx";

function TopGems() {
  const [gems, setGems] = useState([]);
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const gemRes = await axios.get("/getAllGems");
      setGems(gemRes.data.gems);
    };

    fetchData();
  }, [reload]);

  const gemCards = gems
    .sort((a, b) => b.enjoyAvg - a.enjoyAvg)
    .map((gem, i) => (
      <GemCard key={i} i={i} gem={gem} reload={reload} setReload={setReload} showButtons={false}/>
    ));

  return (
    <div className="top-gems-container">
      <h1 className="top-gems-title">Top Gems</h1>
      <div className="gems-grid">{gemCards}</div>
    </div>
  );
}

export default TopGems;
