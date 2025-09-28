"use client"
import "./page.css";
import Masonry from 'react-masonry-css';
import React, { useState, useEffect } from 'react';
import { AllPoemsMongo } from "./backend/mongo";
import { useRouter } from "next/navigation";
import { AllVideosMongo } from "./backend/vmongo";


export default function Home() {
  const [poems, setPoems] = useState([]);
  const [Titles, setTitles] = useState([]);
  const [Videos, setVideos] = useState([]);
  const navigate = useRouter();
  // New search-related states
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPoems, setFilteredPoems] = useState([]);
  const [Writeups, setWriteups] = useState(true)
  useEffect(() => {
    async function fetchData() {
      await AllPoemsMongo().then((response) => {
        const reversedPoems = response.data.reverse();
        setPoems(reversedPoems);
        setTitles(reversedPoems.map((item) => item.title));
        // console.log(poems);
      });
      await AllVideosMongo().then((response) => {
        const reversedVideos = response.data.reverse();
        setVideos(reversedVideos);
        // console.log(Videos);
        // console.log(reversedVideos)
      });
    }
    fetchData();
  }, []);

  // Filter poems as user types
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPoems([]);
    } else {
      setFilteredPoems(
        poems.filter((poem) =>
          poem.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, poems]);

  const breakpointColumnsObj = {
    default: 2,
  };
  const poemClick = (id) => () => {
    navigate.push(`/${id}`);
  }

  const texts = ["/bgimages/s1.jpg", "/bgimages/s2.jpg", "/bgimages/s3.jpg", "/bgimages/s4.jpg", "/bgimages/s6.jpg", "/bgimages/s5.jpg"];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000); // Change text every 3 seconds
    return () => clearInterval(interval);
  }, [texts.length]);

  // ...existing code...
  // Helper function to convert normal YouTube links to embed links
  function getYouTubeEmbedUrl(url) {
    // Add safety check for undefined/null url
    if (!url || typeof url !== 'string') {
      return null; // Return null instead of empty string
    }

    // Handle youtu.be and youtube.com/watch?v= links
    const shortMatch = url.match(/^https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/);
    const longMatch = url.match(/^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
    let videoId = null;
    if (shortMatch) {
      videoId = shortMatch[1];
    } else if (longMatch) {
      videoId = longMatch[1];
    }
    if (videoId) {
      console.log(videoId);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null; // Return null instead of original URL if not matched
  }
  // ...existing code...

  return (
    <>
      <div className="flex justify-between w-full m-0 flex-col">
        <div className="box">
          <div className="box1">
            <div className="images">
              <div className="image-text">Soumya Jain</div>
              <img src={texts[currentTextIndex]} alt="" className="image" />
              <img src={texts[currentTextIndex]} alt="" className="imgbackground" />
            </div>
          </div>

          <div className="box2">
            <div className="header">
              <div className="title2">{Writeups ? "My Writeups" : "Videos"}</div>
              <div className="toggle">

                <button className={Writeups ? "toggleactive" : "togglebtn"} onClick={() => setWriteups(true)}>Writeups</button>
                <button className={Writeups ? "togglebtn" : "toggleactive"} onClick={() => setWriteups(false)}>Videos</button>

              </div>
            </div>
            {(poems.length == 0) ? (
              <div className="loading">Loading</div>
            ) : (
              Writeups ? (
                <>
                  <div className="header">

                    <div className="search">
                      <input
                        type="search"
                        placeholder="Search Poems"
                        className="searchInput"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    {/* Search results below the input */}
                    {searchTerm && (
                      <div className="searchResults">
                        {filteredPoems.length === 0 ? (
                          <div className="searchItem">No results found</div>
                        ) : (
                          filteredPoems.map((poem) => (
                            <div key={poem.id} className="searchItem" onClick={poemClick(poem.id)}>
                              {poem.title}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <div className="poems">
                    <Masonry
                      breakpointCols={breakpointColumnsObj}
                      className="my-masonry-grid"
                      columnClassName="my-masonry-grid_column"
                    >
                      {poems.map(poem => (
                        <div className="poemCard" onClick={poemClick(poem.id)} key={poem.id}>
                          <div className="poemImage">
                            <img className="pImg" src={poem.filename} alt="poem" />
                          </div>
                          <div className="poemTitle">{poem.title}</div>
                        </div>
                      ))}
                    </Masonry>
                  </div>
                </>

              ) : (

                <div className="videos">
                 
                    {Videos.map(video => {
                      const embedUrl = getYouTubeEmbedUrl(video.video);
                      return (
                        <div className="videoCard" key={video._id || video.id}>
                          {embedUrl ? (
                            <iframe
                              width="560"
                              height="315"
                              src={embedUrl}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <div className="no-video">Invalid video URL</div>
                          )}
                          <div className="poemTitle">{video.title}</div>
                        </div>
                      );
                    })}
               
                </div>
                // ...existing code...
              )
            )}

          </div>
        </div>
      </div>
    </>
  );
}
