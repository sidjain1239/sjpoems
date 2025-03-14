"use server";
import mongoose from "mongoose";
import Data from "./schema";

let conn = mongoose.connect(process.env.MONGODB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

export const PoemMongo = async (id) => {
  await conn; // Ensure the connection is established
  const detail = await Data.findOne({ id: id }).lean(); // Convert to plain JavaScript object

  return { value: true, data: JSON.parse(JSON.stringify(detail)) }; // Ensure plain object
};