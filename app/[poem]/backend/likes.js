"use server";
import mongoose from "mongoose";
import Data from "./schema";

let conn = mongoose.connect(process.env.MONGODB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

export const LikeMongo = async (id) => {
  await conn; // Ensure the connection is established
  const detail = await Data.findOne({ id: id }).lean(); // Convert to plain JavaScript object

  await Data.updateOne({ id: id }, { likes: detail.likes + 1 });
  const updatedDetail = await Data.findOne({ id: id }).lean();
  return updatedDetail.likes;
};