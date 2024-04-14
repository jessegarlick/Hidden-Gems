import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import axios from "axios";

// Components/Pages/CSS
import RatingBar from "./RatingBar.jsx";
import "../CSS/GemCard.css";
import editIcon from "../public/edit.svg";
import deleteIcon from "../public/delete.svg";

function GemCard(props) {
    const { gem, i, reload, setReload, showButtons } = props;
    const foregroundColorState = useSelector(state => state.foregroundColor);
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/updateGem/${gem.gemId}`);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/deleteGem/${gem.gemId}`);
            setReload(!reload);
        } catch (error) {
            console.error("Error deleting gem:", error);
        }
    };

    return (
        <div key={i} className="gem-card" style={{ backgroundColor: foregroundColorState }}>
            <h1 className="gem-location">
                {gem.name}
            </h1>
            {gem?.imgUrl && (
                <img src={gem.imgUrl} alt={gem.name} className="gem-image" />
            )}
            {!gem?.imgUrl && <div className="gem-image-placeholder"></div>}
            <p className="gem-description">{gem.description}</p>
            <div className="rating-bar-button-container">
                <div className="rating-bar-icon-container">
                    Enjoyability:
                    <RatingBar
                        reload={reload}
                        setReload={setReload}
                        gemId={gem.gemId}
                        rating={gem.enjoyAvg ? gem.enjoyAvg : 0}
                        type="enjoyability"
                    />
                    Popularity:
                    <RatingBar
                        reload={reload}
                        setReload={setReload}
                        gemId={gem.gemId}
                        rating={gem.popularAvg ? gem.popularAvg : 0}
                        type="popularity"
                    />
                         {showButtons && (
                    <div className="buttons">
                        <button className="icon-button edit-button" onClick={handleEdit}>
                            <img src={editIcon} className="icon" />
                            Edit
                        </button>
                        <button className="icon-button delete-button" onClick={handleDelete}>
                            <img src={deleteIcon} className="icon" />
                            Delete
                        </button>
                    </div>
                )}
                </div>
           
                <Button
                    variant="outline-info"
                    className="hyper-link"
                    onClick={() => {
                        navigate("/details", { state: { gemId: gem.gemId } });
                        console.log("button was clicked");
                    }}
                    style={{ margin: "auto", marginTop: 5 }}
                >
                    Full Details
                </Button>
                {/* Adjust the navigation path as needed */}
            </div>
        </div>
    );
}

export default GemCard;
