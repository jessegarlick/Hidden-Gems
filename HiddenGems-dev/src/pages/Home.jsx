
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from "react-bootstrap";
import axios from 'axios';

// Components/Pages/CSS
import CreateGem from '../components/CreateGem.jsx';
import MapComponent from '../components/Map.jsx';
import GemCard from '../components/GemCard.jsx';
import "../CSS/Home.css"

function Home() {
  const userId = useSelector(state => state.userId);
  const loading = useSelector(state => state.loading);
  const [showCreateGem, setShowCreateGem] = useState(false);
  const [followingGems, setFollowingGems] = useState([]);
  const [reload, setReload] = useState(false);
  const backgroundColor = useSelector(state => state.backgroundColor)

  const navigate = useNavigate();

  const handleCreateGemClick = () => {
    setShowCreateGem(true)
  };

  const getFollowingGems = async () => {
    const gemsToUpdate = [];
    const { data } = await axios.get("/getFriends")
    const friends = data.friends

    for (let i = 0; i < friends.length; i++) {
      const res = await axios.get(`/getFollowingGems/${friends[i].userId}`);
      gemsToUpdate.push(...res.data.gems);
      if (i === friends.length - 1) {
        setFollowingGems(gemsToUpdate);
      }
    }
  }

  useEffect(() => {
    if (!userId && !loading) {
      navigate("/login")
    } else {
      getFollowingGems()
      const background = document.querySelectorAll(".background")
      background.forEach((item) => {
        item.style.backgroundColor = backgroundColor
      })
    }

  }, [userId, loading, reload]);

  const gemCards = followingGems.map((gem, i) => (
    <GemCard key={i} i={i} gem={gem} reload={reload} setReload={setReload} showButtons={false}/>
  ));
  
  return (
    <>
      {!showCreateGem && (
        <div className="home-page center background">
          <label className="title">Gems Near You</label>
          <div className="home-map">
            <MapComponent />
          </div>
            <Button 
              variant="info" 
              className="create-gem-btn"
              onClick={handleCreateGemClick}
            >
              Create Gem
            </Button>
          <div>
            <label className="sub-title">Following Feed:</label>
            <div className='gem-grid'>
              {gemCards}
            </div>
          </div>
        </div>
      )}
      {showCreateGem && <CreateGem />}
    </>
  )
}

export default Home;
