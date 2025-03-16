"use server";
import mongoose from "mongoose";
import Data from "./cshema";

let conn = mongoose.connect(process.env.MONGODB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

export const GetCommentMongo = async (id) => {
  await conn; // Ensure the connection is established
  const detail = await  Data.find({poem:id}).lean();

    // Convert each _id to a string
    detail.forEach((item) => {
      item._id = item._id.toString();
    });
 
    return ({ value: true,data:detail});
  
  
};