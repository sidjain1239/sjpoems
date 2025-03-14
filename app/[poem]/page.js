"use client";
import React, { useEffect, useState } from 'react';
import styles from './Poem.module.css';
import { useParams } from 'next/navigation';
import { PoemMongo } from './backend/mongo';
import { LikeMongo } from './backend/likes';

const Page = () => {
  const { poem } = useParams();
  const [poemData, setPoemData] = useState(null);
  const [Likes, setLikes] = useState(0);

  useEffect(() => {
    async function fetchData() {
      await PoemMongo(poem)
        .then((response) => {
          setPoemData(response.data);
          setLikes(response.data.likes);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
    fetchData();
  }, [poem]);

  const likeBtn = async () => {
    try {
      const updatedLikes = await LikeMongo(poem);
      setLikes(updatedLikes);
    } catch (error) {
      console.error("There was an error updating likes!", error);
    }
  };

  const shareBtn = () => {
    if (navigator.share) {
      navigator.share({
        title: poemData.title,
        text: 'Check out this poem!',
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.error('Error sharing', error));
    } else {
      console.error('Web Share API not supported in this browser');
    }
  };

  return (
    <div className="flex justify-between w-full m-0 flex-col">
      <div className={styles.pBox}>
        {poemData ? (
          <div className='flex flex-col justify-center items-center'>
            <h1 className={styles.title3}>{poemData.title}</h1>
            <img className={styles.image} src={poemData.filename} alt="" />
            <div className={styles.control}>
              <div className={styles.like} onClick={likeBtn}>
                <img src="/like.png" alt="" />
                <p> Like {"("}{Likes}{")"}</p>
              </div>
              <div className={styles.like} onClick={shareBtn}>
                <img src="/share.png" alt="" />
                <p> Share</p>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Page;