// Friends.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FloatingLabel, Form } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useSelector } from "react-redux"; // Assuming you are using Redux
import "../CSS/Friends.css";

const animStr = (i) =>
  `fadeInAnimation ${650}ms ease-out ${100 * (i + 1)}ms forwards`;

function Friends() {
  const navigate = useNavigate(); // Hook to programmatically navigate
  const userId = useSelector((state) => state.userId);
  const [searchResults, setSearchResults] = useState([]);
  const [currentFriends, setCurrentFriends] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getCurrentFriends();
  }, []);

  useEffect(() => {
    if (searchText) {
      getSearchResults();
    }
  }, [searchText]);

  const getSearchResults = async () => {
    const { data } = await axios.get(`/getSearchResults/${searchText}`);
    if (data.success) {
      setSearchResults(data.searchResults);
    }
  };

  const getCurrentFriends = async () => {
    const { data } = await axios.get("/getFriends");
    if (data.success) {
      setCurrentFriends(data.friends);
    }
  };

  const followUser = async (idToFollow) => {
    const { data } = await axios.post(`/followUser/${idToFollow}`);
    console.log(data.message);
    if (data.success) {
      getCurrentFriends();
    }
  };

  const unfollowUser = async (idToUnfollow) => {
    const { data } = await axios.delete(`/unfollowUser/${idToUnfollow}`);
    console.log(data.message);
    if (data.success) {
      getCurrentFriends();
    }
  };

  const navigateToFriendProfile = (friendUserId) => {
    navigate(`/profile2/${friendUserId}`); // Navigate to the friend's profile page
  };

  const searchCards = searchResults.map((user, i) => (
    <div
      key={i}
      className="user-display"
      style={{ width: "80%", animation: animStr(i) }}
    >
      <label className="email-label">{user.email}</label>
      <button className="search-button" onClick={() => followUser(user.userId)}>
        Follow
      </button>
    </div>
  ));

  const friendCards = currentFriends.map((friend, i) => (
    <div
      key={i}
      className="friend-card"
      style={{ animation: animStr(i) }}
      onClick={() => navigateToFriendProfile(friend.userId)}
    >
      {friend?.imgUrl && (
        <img
          src={friend.imgUrl}
          alt={friend.firstName}
          className="friend-image"
        />
      )}
      <div className="friend-info">
        <div className="friend-name">
          <div className="name">
            {friend.firstName} {friend.lastName}
          </div>
          <div className="email">{friend.email}</div>
        </div>
        <div className="friend-actions">
          <button
            className="search-button"
            onClick={(e) => {
              e.stopPropagation();
              unfollowUser(friend.userId);
            }}
          >
            Unfollow
          </button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="friends-container">
      <div className="current-friends">
        <h1 className="center">Following</h1>
        <div className="friends-list">{friendCards}</div>
      </div>
      <div className="add-friends">
        <h1 className="center">Find User</h1>
        <div className="search-container">
          <div className="search-bar">
            <FloatingLabel label="Email">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </FloatingLabel>
          </div>

          {searchCards}
        </div>
      </div>
    </div>
  );
}

export default Friends;
