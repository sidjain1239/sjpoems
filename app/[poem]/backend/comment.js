"use server";
import mongoose from "mongoose";
import Data from "./cshema";

let conn = mongoose.connect(process.env.MONGODB, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

export const CommentMongo = async (id,name,comment) => {
  await conn; // Ensure the connection is established

  const detail = await new Data({ name: name, comment: comment, poem: id });
    await detail.save()
    return ({ value: true });
  
};