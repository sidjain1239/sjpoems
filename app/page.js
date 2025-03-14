"use client"
import "./page.css";
import Masonry from 'react-masonry-css';
import React, { useState, useEffect } from 'react';
import { AllPoemsMongo } from "./backend/mongo";
import { useRouter } from "next/navigation";

export default function Home() {
  const [poems, setPoems] = useState([]);
  const [Titles, setTitles] = useState([]);
const navigate = useRouter();
  // New search-related states
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPoems, setFilteredPoems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      await AllPoemsMongo().then((response) => {
        const reversedPoems = response.data.reverse();
        setPoems(reversedPoems);
        setTitles(reversedPoems.map((item) => item.title));
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
  return (
    <>
      <div className="flex justify-between w-full m-0 flex-col">
        <div className="box">
          <div className="box1">
            <div className="title">Poems <br /> By <br />Soumya Jain</div>
            <div className="disc">
              Myself Soumya Jain. I am 16 right now...
              I hope you will enjoy reading my Write ups.<br />
              Thank you
            </div>
          </div>

          <div className="box2">
            <div className="header">
              <div className="title2">My Writeups</div>
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
                      <div key={poem.id} className="searchItem">
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
          </div>
        </div>
      </div>
    </>
  );
}