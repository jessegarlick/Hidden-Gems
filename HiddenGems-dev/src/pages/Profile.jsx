import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/Profile.css"; // Import the CSS file for styling
import { Upload } from "react-bootstrap-icons";
import { useSelector } from "react-redux";
import { Collapse } from "react-bootstrap";
import Friends from "../components/Friends.jsx";
import { useDispatch } from "react-redux";

// Components
import GemCard from "../components/GemCard";
import EditColor from "../public/editColor.svg";

function Profile() {
  const userId = useSelector((state) => state.userId);
  const loading = useSelector((state) => state.loading);
  const backgroundColorState = useSelector((state) => state.backgroundColor);
  const foregroundColorState = useSelector((state) => state.foregroundColor);
  const navbarColorState = useSelector((state) => state.navbarColor);

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [gems, setGems] = useState([]);
  const [reload, setReload] = useState(false);
  const [imgUploadStatus, setImgUploadStatus] = useState("");
  const [showFriends, setShowFriends] = useState(false); // State to control Friends component visibility
  const [navbarColor, setNavbarColor] = useState(navbarColorState); // Added for background color change
  const [backgroundColor, setBackgroundColor] = useState(backgroundColorState); // Added for background color change
  const [foregroundColor, setForegroundColor] = useState(foregroundColorState); // Added for background color change
  const [showColorPickers, setShowColorPickers] = useState(false); // State to control color pickers visibility

  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId && !loading) {
      navigate("/login")
    } else {
      getUser();
    }
  }, [userId, loading, reload]);

  useEffect(() => {
    dispatch({
      type: "UPDATE_NAVBAR",
      payload: navbarColor,
    });
    console.log("updating navbar color");
  }, [navbarColor]);

  useEffect(() => {
    dispatch({
      type: "UPDATE_BACKGROUND",
      payload: backgroundColor,
    });
    console.log("updating background color");
  }, [backgroundColor]);

  useEffect(() => {
    dispatch({
      type: "UPDATE_FOREGROUND",
      payload: foregroundColor,
    });
    console.log("updating foreground color");
  }, [foregroundColor]);

  const getUser = async () => {
    if (userId) {
      const response = await axios.get(`/getUserInfo/${userId}`);
      setUserInfo(response.data.user);
      const { data } = await axios.get(`/getGemsFromUserId/${userId}`);
      setGems(data.gems);
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`/getUserInfo/${userId}`);
  //       setUserInfo(response.data.user);
  //       const { data } = await axios.get(`/getGemsFromUserId/${userId}`);
  //       setGems(data.gems);
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };
  //   fetchData();
  // }, [userId]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.amazonaws.com/js/aws-sdk-2.813.0.min.js";
    script.async = true;
    script.onload = () => {
      window.AWS.config.update({
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
        region: import.meta.env.VITE_AWS_REGION,
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const uploadFile = (file, type) => {
    const s3 = new window.AWS.S3();
    const keyPrefix = type === "profile" ? "profile-images/" : "header-images/";
    const params = {
      Bucket: "hidden-gems-dev-mountain",
      Key: `${keyPrefix}${userId}-${file.name}`,
      Body: file,
    };
    s3.upload(params, async (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        setImgUploadStatus(`Failed to upload ${type} image.`);
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        try {
          const updateEndpoint =
            type === "profile"
              ? `/updateUserProfileImg/${userId}`
              : `/updateUserHeaderImg/${userId}`;
          await axios.put(updateEndpoint, {
            [type === "profile" ? "imgUrl" : "headerImgUrl"]: data.Location,
          });
          setReload(!reload); // Trigger reload to fetch updated user info
        } catch (error) {
          console.error(`Error updating ${type} profile image:`, error);
          setImgUploadStatus(`Failed to update ${type} profile image.`);
        }
      }
    });
  };

  const saveColors = async () => {
    const data = {
      navbarColor,
      backgroundColor,
      foregroundColor,
    };
    const res = await axios.put("/saveColors", data);
    console.log(res.data.success);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file, type);
    }
  };

  const handleFriendsButtonClick = () => {
    setShowFriends(!showFriends); // Toggle Friends component visibility
  };
  const toggleColorPickersVisibility = () => {
    setShowColorPickers(!showColorPickers); // Toggle color pickers visibility
  };
  useEffect(() => {
    document.body.style.backgroundColor = backgroundColorState;
  }, [backgroundColor]);

  if (!userInfo) {
    return <div>Loading...</div>; // Loading state
  }

  const gemCards = gems.map((gem, i) => (
    <GemCard
      key={i}
      i={i}
      gem={gem}
      reload={reload}
      setReload={setReload}
      showButtons={true}
    />
  ));

  return (
    <div
      className="profile-container"
      style={{ backgroundColor: foregroundColor }}
    >
      <div className="profile-image-section">
        {userInfo?.headerImgUrl && (
          <img
            src={userInfo.headerImgUrl}
            alt="User header"
            className="header-image"
            onClick={() => document.getElementById("headerFileInput").click()}
          />
        )}
        <input
          type="file"
          id="headerFileInput"
          onChange={(e) => handleFileChange(e, "header")}
          className="file-input"
          style={{ display: "none" }}
        />
        {/* <button
          className="icon-button header-upload-btn"
          onClick={() => document.getElementById("headerFileInput").click()}
          aria-label="Upload header image"
        >
          <Upload size={24} />
        </button> */}
        {userInfo?.imgUrl && (
          <img
            src={userInfo.imgUrl}
            alt="User profile"
            className="profile-image"
            onClick={() => document.getElementById("fileInput").click()}
          />
        )}
        <input
          type="file"
          id="fileInput"
          onChange={(e) => handleFileChange(e, "profile")}
          className="file-input"
          style={{ display: "none" }}
        />
        {/* <button
          className="icon-button"
          onClick={() => document.getElementById("fileInput").click()}
          aria-label="Upload profile image"
        >
          <Upload size={24} />
        </button> */}
      </div>
      <br />
      <div className="user-name">
        {userInfo.firstName} {userInfo.lastName}
      </div>
      <h2 className="user-email">{userInfo.email}</h2>
      <hr />
      {/* Color Picker Button and Input */}
      <div className="color-picker-container">
        {/* Color pickers */}
        <div className="edit-icon-container">
        <img
          src={EditColor}
          alt="no image"
          onClick={toggleColorPickersVisibility}
          className="edit-colors-icon"
          />
          </div>
          <Collapse in={showColorPickers}>
          <div>
          <div className="color-picker-section">
            <div className="color-pickers" >
            <div >
              <h5>Background Color:</h5>
              <input
              className="picker"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                />
               </div>
               <div >
              <h5>Navbar Color:</h5>
              <input
              className="picker"
                type="color"
                value={navbarColor}
                onChange={(e) => setNavbarColor(e.target.value)}
              />
              </div>
              <div >
              <h5>Foreground Color:</h5>
              <input
              className="picker"
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
              />
              </div>
            </div>
            {/* <div className="save-btn-container"> */}
            <button
              onClick={() => {
                saveColors();
                toggleColorPickersVisibility();
              }}
              className="save-colors-btn"
            >
              Save
            </button>
            {/* </div> */}
          </div>
        </div>
          
          </Collapse>

        

       
      </div>
      <div className="friend-button-container">
      <button className="friend-button" onClick={handleFriendsButtonClick}>
      Following
      </button>
      </div>
      <Collapse in={showFriends}>
        <div>
          <Friends />
        </div>
      </Collapse>

      <div className="gems-section">
        <div className="GemsYouCreated">Gems You Created</div>
        <ul className="gem-cards">{gemCards}</ul>
      </div>
      <div className="comments-section">
        <h2>Comments</h2>
        <ul>
          {userInfo.comments.map((comment, index) => (
            <li key={index} className="comment">
              {comment.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Profile;
