import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../CSS/Discover.css';
import GemCard from '../components/GemCard.jsx';



function Discover() {
  const [query, setQuery] = useState('');
  const [gems, setGems] = useState([]);
  const [reload, setReload] = useState(false);
  const [tags, setTags] = useState([]);
  const [sortByPopularity, setSortByPopularity] = useState(false);
  const [selectedTags, setSelectedTags] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
  }); // Track selected tags

  useEffect(() => {
    const fetchData = async () => {
      const gemRes = await axios.get('/getAllGems');
      setGems(gemRes.data.gems);
    };
    fetchData();
    fetchTags();
  }, [reload]);

  // const handleSearch = async () => {
  //   try {
  //     const encodedQuery = encodeURIComponent(query);
  //     const searchRes = await axios.get(`/searchGems/${query}`);
  //     setGems(searchRes.data.gems);
  //   } catch (error) {
  //     console.error('Error searching gems:', error);
  //     // Handle error, e.g., display an error message to the user
  //   }
  // };
  const handleSearch = async () => {
    try {
      if (query.trim() !== '' && !query.includes('.')) { // Check if the query is not empty
        const encodedQuery = encodeURIComponent(query);
        const searchRes = await axios.get(`/searchGems/${encodedQuery}`);
        setGems(searchRes.data.gems);
      } else {
        // If the query is empty, reset the gems to the full list
        fetchData();
      }
    } catch (error) {
      console.error('Error searching gems:', error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const anyTagsSelected = () => {
    for (let i = 1; i <= 12; i++) {
      if (selectedTags[i]) {
        return true;
      }
    }
    return false;
  };

  const handleSortByPopularity = () => {
    setSortByPopularity(!sortByPopularity);
  };

  const gemCards = anyTagsSelected()
    ? gems
        .filter((gem) => {
          for (const tag of gem.tags) {
            if (selectedTags[tag.tagId]) {
              return true;
            }
          }
          return false;
        })
        .sort((a, b) => (sortByPopularity ? b.enjoyAvg - a.enjoyAvg : 0))
        .map((gem, i) => <GemCard key={i} i={i} gem={gem} reload={reload} setReload={setReload} showButtons={false} />)
    : gems
        .sort((a, b) => (sortByPopularity ? b.enjoyAvg - a.enjoyAvg : 0))
        .map((gem, i) => <GemCard key={i} i={i} gem={gem} reload={reload} setReload={setReload} showButtons={false} />);

  const fetchData = async () => {
    const gemRes = await axios.get('/getAllGems');
    setGems(gemRes.data.gems);
  };

  const fetchTags = async () => {
    const tags = await axios.get('/getAllTags');
    setTags(tags.data.tags);
  };

  useEffect(() => {
    if (query !== '') {
      handleSearch();
    } else {
      fetchData();
    }
  }, [query, sortByPopularity]);

  useEffect(() => {
    if (sortByPopularity) {
      // Fetch data when sorting by popularity is toggled
      fetchData();
    }
  }, [sortByPopularity]);

  return (
    <>
      <div className="discover">
       
        <div className="header">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search gems..."
              id="searchInput" // Add a unique id attribute
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            /> 
            <button onClick={handleSearch}>Search</button>

            <button
              onClick={handleSortByPopularity}
              className={`sort-button ${sortByPopularity ? 'sort-button-active' : ''}`}
                >
              Sort by Enjoyability
                </button>
          </div>
          <div className='tags-container' >
           
            {tags.map((tag, i) => (
              <button
                id="tagsButton"
                key={`tag-${tag.tagId}`}
                value={tag.tagName}
                onClick={() => {
                  setSelectedTags({ ...selectedTags, [i + 1]: !selectedTags[i + 1] });
                }}
                className={selectedTags[i + 1] ? 'selected' : ''}
              >
                {tag.tagName}
              </button>
            ))}
          </div>
         
        </div>
        <div className="discover-container">
          <div className="gems-grid">{gemCards}</div>
        </div>
      </div>
    </>
  );
}

export default Discover;