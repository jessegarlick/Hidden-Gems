import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams  } from "react-router-dom";
import "../CSS/Profile2.css";
import { Button } from "react-bootstrap";
import GemCard from "../components/GemCard";

function Profile2() {
  const { userId } = useParams();
  const [userInfo, setUserInfo] = useState(null);
  const [gems, setGems] = useState([]);

  useEffect(() => {
    const getUserInfoAndGems = async () => {
      try {
        const userInfoResponse = await axios.get(`/getUserInfo/${userId}`);
        setUserInfo(userInfoResponse.data.user);
        const gemsResponse = await axios.get(`/getGemsFromUserId/${userId}`);
        setGems(gemsResponse.data.gems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userId) {
      getUserInfoAndGems();
    }
  }, [userId]);

  
  

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const gemCards = gems.map((gem, i) => (
    <GemCard key={i} i={i} gem={gem} showButtons={false} />
  ));

  return (
    <div className="profile-container">
     
      <div className="profile-image-section">
        {userInfo.headerImgUrl && <img src={userInfo.headerImgUrl} alt="User header" className="header-image" />}
        {userInfo.imgUrl && <img src={userInfo.imgUrl} alt="User profile" className="profile-image" />}
      </div>
      <h1 className="user-name">{userInfo.firstName} {userInfo.lastName}</h1>
      <h2 className="user-email">{userInfo.email}</h2>
    
      
      <div className="gems-section">
        <h2>Gems You Created</h2>
        <div className="gem-cards">{gemCards}</div>
      </div>
      <div className="comments-section">
        <h2>Comments</h2>
        <ul>
          {userInfo.comments?.map((comment, index) => (
            <li key={index} className="comment">{comment.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile2;
