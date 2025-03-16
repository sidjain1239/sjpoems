import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentDetailsSchema = new Schema({
  name: { type: String, required: true },
  comment: { type: String, required: true },
  poem: { type: Number,}

});

const Data = mongoose.models['comment'] || mongoose.model('comment', commentDetailsSchema);
export default Data;