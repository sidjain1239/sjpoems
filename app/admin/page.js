
"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from "./Admin.module.css"
import { UploadMongo } from './backend/mongo';

export default function UploadImage() {
  const { register, handleSubmit } = useForm();
  const [Success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Err, setErr] = useState("");
  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSuccess("")
    setErr("")
    try{
    if (!data.file?.[0]) return;

    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await res.json();
    console.log(result.secure_url);
    const image = result.secure_url;
    const title = data.title;

    
      await UploadMongo(title,image)
        .then((response) => {
          if (response.value) {
            setSuccess("Uploaded Successfully.")
            setIsSubmitting(false)
          
          } else {
            setErr("Error. Please try again")
            setIsSubmitting(false)
          }
        })
    
  }
  catch(err){
    console.log(err)
    setErr("Server Error. Please try again")
    setIsSubmitting(false)
  }
  };
  
  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>Upload poem</h1>
      <label>Title</label>
      <input type="text" className={styles.title} {...register('title')} />
      <br />
      
      <label>File</label>
      <input type="file" {...register('file')} />
      <button type="submit">Upload</button>
{isSubmitting ? <div className={styles.loader}></div> : <input type="submit" className={styles.button} value="Submit Credentials" />}
    </form>
    <div className="flex justify-center items-center flex-col">

<div className={styles.error}>{Err}</div>
<div className={styles.success}>{Success}</div>
</div>
    </>
  );
}
