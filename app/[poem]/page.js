"use client";
import React, { useEffect, useState } from 'react';
import styles from './Poem.module.css';
import { useParams } from 'next/navigation';
import { PoemMongo } from './backend/mongo';
import { LikeMongo } from './backend/likes';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { CommentMongo } from './backend/comment';
import { GetCommentMongo } from './backend/getcomment';

const Page = () => {
  const navigate = useRouter();
  const { poem } = useParams();
  const { register, handleSubmit } = useForm();
  const [Comments, setComments] = useState([]);
  const [poemData, setPoemData] = useState(null);
  const [Likes, setLikes] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        text: `Check out this poem by Soumya Jain on ${poemData.title}`,
        url: window.location.href,
      })
        .catch((error) => { });
    } else {
      console.error('Web Share API not supported in this browser');
    }
  };

  const handleCommentSubmit =async (data) => {
    const name=data.name;
    const comment=data.comment;
    await CommentMongo(poem,name,comment)
    .then((response) => {
      setComments([...Comments, { name: name, comment: comment }]);

    })
    .catch((error) => {
      console.error("There was an error submitting the comment!", error);
    });
    document.querySelector('form').reset();
  };

  const commentBtn = (data) => {
    setIsModalOpen(true);
    GetCommentMongo(poem)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching comments!", error);
  });
  }

  return (
    <div className="flex justify-between w-full m-0 flex-col">
      <div className={styles.pBox}>
        {poemData ? (
          <div className='flex flex-col '>
            <div className={styles.back} onClick={() => navigate.push("/")}>
              <img src="/back.png" alt="" />
              Back</div>
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

              <div className={styles.like} onClick={commentBtn}>
                <img src="/comment.png" alt="" />
                <p>Comment</p>
              </div>
            </div>
          </div>
        ) : (
          <p className={styles.loading}>Loading...</p>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Comments</h2>
            <div className={styles.comments}>
              {Comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <p><strong>{comment.name}</strong></p>
                  <p>{comment.comment}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit(handleCommentSubmit)} className={styles.form}>
              <input
                type="text"
                {...register("name")}
                className={styles.text}
                placeholder="Your Name"
              />
              <input
                type="text"
                {...register("comment")}
                className={styles.text}
                placeholder="Your Comment" />
              <button type='submit' className={styles.submitButton}>Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;