"use server";
import mongoose from "mongoose";
import Data from "./vschema";


let conn = mongoose.connect(process.env.MONGODB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

export const UploadVMongo = async (title,video) => {
  await conn; // Ensure the connection is established
  const timestamp = Date.now();
  const detail = await new Data({ id:timestamp , title: title,  video: video, likes: 0 })
    await detail.save()
    return ({ value: true });
  
};