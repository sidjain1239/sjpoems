"use server";
import mongoose from "mongoose";
import Data from "./schema";

let conn = mongoose.connect(process.env.MONGODB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

export const AllPoemsMongo = async () => {
  await conn; // Ensure the connection is established
  const detail = await  Data.find({}).lean();

    // Convert each _id to a string
    detail.forEach((item) => {
      item._id = item._id.toString();
    });
 
    return ({ value: true,data:detail });
  
};