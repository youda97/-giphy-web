import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface Image {
  id: string;
  title: string;
  images: {
    downsized_medium: {
      url: string;
    };
  };
}

const GiphyApp = () => {
  const [query, setQuery] = useState("");
  const [text, setText] = useState("");
  const [textPlacement, setTextPlacement] = useState("on-top");
  const [images, setImages] = useState<Image[]>([]);
  const [offset, setOffset] = useState(0);
  const [cachedImages, setCachedImages] = useState<Image[]>([]);

  const API_KEY = "1bkG7ky5cmw5SLyvNfElcR1iYVzs38Zq";
  const API_URL = "https://api.giphy.com/v1/gifs/search";

  const handleSearch = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          q: query,
          rating: "g",
          limit: 3,
          offset: offset,
        },
      });
      setImages(response.data.data);
      if (offset === 0) {
        setCachedImages(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleSearch(); // Call handleSearch whenever the offset changes
  }, [offset]);

  const handleNext = () => {
    setOffset((prevOffset) => prevOffset + 3);
  };

  const handlePrevious = () => {
    if (offset >= 3) {
      setOffset((prevOffset) => prevOffset - 3);
    }
  };

  const handleTextPlacementChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTextPlacement(e.target.value);
  };

  return (
    <div>
      <h1>Giphy Image Search</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Search query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Text to display"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select value={textPlacement} onChange={handleTextPlacementChange}>
          <option value="on-top">On top of image - center top</option>
          <option value="on-bottom">On top of image - center bottom</option>
          <option value="below-center">Below image - center</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="image-container">
        {images.map((image) => (
          <div key={image.id} className="image-wrapper">
            <img src={image.images.downsized_medium.url} alt={image.title} />
            <p className={`text text--${textPlacement}`}>{text}</p>
          </div>
        ))}
      </div>

      <div className="navigation-buttons">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default GiphyApp;
