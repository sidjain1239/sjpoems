"use server";
import mongoose from "mongoose";
import Data from "./schema";

let conn = mongoose.connect(process.env.MONGODB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

export const UploadMongo = async (title,filename) => {
  await conn; // Ensure the connection is established
  const timestamp = Date.now();
  const detail = await new Data({ id:timestamp , title: title,  filename: filename, likes: 0 })
    await detail.save()
    return ({ value: true });
  
};