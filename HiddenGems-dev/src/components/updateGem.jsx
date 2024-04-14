import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../CSS/UpdateGem.css";
import { Upload } from "react-bootstrap-icons";
import MapComponent from "./Map.jsx";

const UpdateGem = () => {
  const { gemId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  // Fetch available tags from the backend
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data } = await axios.get("/getAllTags");
        setAvailableTags(data.tags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  const updateCords = (newLat, newLng) => {
    setLat(newLat);
    setLng(newLng);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/getGem/${gemId}`);
        const { name, description, imgUrl, lat, lng, tags } = data.gem;
        setName(name);
        setDescription(description);
        setImgUrl(imgUrl);
        setLat(lat);
        setLng(lng);
        setSelectedTagIds(tags.map((tag) => tag.tagId)); // Assuming tags are included in the gem fetch response
      } catch (error) {
        console.error("Error fetching gem data:", error);
      }
    };
    fetchData();
  }, [gemId]);

  const toggleTagSelection = (tagId) => {
    setSelectedTagIds((prevSelectedTagIds) =>
      prevSelectedTagIds.includes(tagId)
        ? prevSelectedTagIds.filter((id) => id !== tagId)
        : [...prevSelectedTagIds, tagId]
    );
  };

  useEffect(() => {
    // Load AWS SDK and configure it
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  function uploadFile(file) {
    const s3 = new window.AWS.S3();
    const fileName = `gems/${Date.now()}-${file.name}`;
    const params = {
      Bucket: "hidden-gems-dev-mountain",
      Key: fileName,
      Body: file,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        setSubmissionStatus("Failed to upload image.");
      } else {
        console.log(`File uploaded successfully. ${data.Location}`);
        setImgUrl(data.Location);
        setSubmissionStatus("File uploaded successfully!");
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/updateGem/${gemId}`,
        { name, description, imgUrl, lat, lng, tags: selectedTagIds },
        { withCredentials: true }
      );
      setSubmissionStatus("Gem updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating gem:", error);
      setSubmissionStatus("Error updating the gem. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "imgUrl":
        setImgUrl(value);
        break;
      case "lat":
        setLat(value);
        break;
      case "lng":
        setLng(value);
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="update-gem-container">
      {submissionStatus && (
        <div className="submission-status">{submissionStatus}</div>
      )}
      <form className="update-gem-form" onSubmit={handleSubmit}>
        <div className="title">
          <h1>Edit Gem</h1>
        </div>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            id="fileUpload"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="Gem image">Gem image:</label>
          {imgUrl && (
            <div
              className="image-container"
              onClick={() => document.getElementById("fileUpload").click()}
            >
              <img className="image" src={imgUrl} alt="Uploaded Gem" />
            </div>
          )}
          <Upload
            size={15}
            onClick={() => document.getElementById("fileUpload").click()}
          />
        </div>
        <div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
          </div>
          <div className="map-container">
            <MapComponent updateCords={updateCords} isCreating={true} />
          </div>
        </div>
        <div className="form-group">
          {availableTags.map((tag) => (
            <label
              key={tag.tagId}
              className={`tag-label ${
                selectedTagIds.includes(tag.tagId) ? "selected" : ""
              }`}
              onClick={() => toggleTagSelection(tag.tagId)}
            >
              <input
                type="checkbox"
                className="tag-checkbox"
                checked={selectedTagIds.includes(tag.tagId)}
                onChange={() => {}}
                onClick={(e) => e.stopPropagation()}
              />
              {tag.tagName}
            </label>
          ))}
        </div>
        <div className="form-actions">
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Update Gem
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateGem;
