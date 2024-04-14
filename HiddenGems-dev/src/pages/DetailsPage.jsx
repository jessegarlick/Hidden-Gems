import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../CSS/Details.css";
import RatingBar from "../components/RatingBar";
import MapComponent from "../components/Map";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Trash } from "react-bootstrap-icons";
import { useSelector } from "react-redux";

function DetailsPage() {
  const [gems, setGems] = useState([]);
  const location = useLocation();
  const { gemId } = location.state || {};
  const [reload, setReload] = useState(false);
  const [formData, setFormData] = useState({ comment: "" });
  const foregroundColorState = useSelector((state) => state.foregroundColor);

  useEffect(() => {
    const fetchData = async () => {
      const gemRes = await axios.get(`/getGem/${gemId}`);
      setGems([gemRes.data.gem]);
    };
    fetchData();
  }, [gemId, reload]);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/getUser/${userId}`);
      const { firstName, lastName } = response.data.user;
      return { firstName, lastName };
    } catch (error) {
      console.error("Error fetching user:", error);
      return { firstName: "", lastName: "" };
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      console.log("Fetching comments...");
      const updatedGems = await Promise.all(
        gems.map(async (gem) => {
          const updatedComments = await Promise.all(
            gem.comments.map(async (comment) => {
              const { firstName, lastName } = await fetchUserDetails(
                comment.userId
              );
              return { ...comment, firstName, lastName };
            })
          );
          return { ...gem, comments: updatedComments };
        })
      );
      if (JSON.stringify(updatedGems) !== JSON.stringify(gems)) {
        setGems(updatedGems);
      }
      console.log("Comments fetched and updated.");
    };
    fetchComments();
  }, [gems]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const commentData = { text: formData.comment, gemId: gemId };
      const response = await axios.post("/createComment", {
        comment: commentData,
      });
      if (response.data.success) {
        setReload(!reload);
        setFormData({ comment: "" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/deleteComment/${commentId}`);
      setReload(!reload);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="details-container">
      {gems.map((gem, i) => (
        <div key={i} className="details-grid">
          {/* Left Container for Gem Details */}
          <div className="gem-details-container">
            <div className="gem-details-content">
              <div className="gem-details-info">
                <div
                  className="img-description-tags-container"
                  style={{ backgroundColor: foregroundColorState }}
                >
                  <div className="gem-img-description-container">
                    <h2 className="gem-details-location">{gem.name}</h2>
                    <div className="img-description-container">
                      {gem?.imgUrl && (
                        <img
                          src={gem.imgUrl}
                          alt={gem.name}
                          className="gem-details-image"
                        />
                      )}

                      <p className="gem-details-description">
                        -{gem.description}
                      </p>
                    </div>
                    <div className="img-description-tags">
                      <h5>Tags:</h5>
                      {gem.tags.map((tag, index) => (
                        <span key={index}>
                          {tag.tagName}
                          {index !== gem.tags.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <div className="rating-bar-container">
                        <div className="rating-bar">
                      <p>Enjoyability:</p>
                      <RatingBar
                        reload={reload}
                        setReload={setReload}
                        gemId={gem.gemId}
                        rating={gem.enjoyAvg ? gem.enjoyAvg : 0}
                        type="enjoyability"
                      />
                      <p>Popularity:</p>
                      <RatingBar
                        reload={reload}
                        setReload={setReload}
                        gemId={gem.gemId}
                        rating={gem.popularAvg ? gem.popularAvg : 0}
                        type="popularity"
                      />
                      </div>
                      </div>
                   
                  </div>

                  <div className="gem-details-ratings-map">
                    <div className="details-flex-container">

                     

                      <div className="map-container">
                        <div className="gem-details-map">
                          <MapComponent gem={gem} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Container for Comments */}
          <div
            className="comments-container"
            style={{ backgroundColor: foregroundColorState }}
          >
            <div className="comments">
                <h6 className="title">Comments:</h6>
              <div className="comments-section">
                {gem.comments && gem.comments.length > 0 ? (
                  <div className="comments-container">
                    {gem.comments.map((comment, index) => (
                      <div key={index} className="comment-container">
                        <div className="text-box-container">
                          <div className="comment-user-id">
                            <p>
                              {comment.firstName} {comment.lastName}
                            </p>
                          </div>
                          
                          <div className="text-btn-container">

                          <div className="comment-entry">
                            <p>{comment.text}</p>
                          </div>
                          <button
                            className="trash-icon-button"
                            onClick={() =>
                              handleDeleteComment(comment.commentId)
                            }
                          >
                            <Trash className="small-trash-icon" />
                          </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
              <form
                onSubmit={handleSubmit}
                className="gem-details-comment-form"
              >
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  className="comment-textarea"
                  rows="4"
                ></textarea>
                <button type="submit" className="comment-submit-btn">
                  Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DetailsPage;
