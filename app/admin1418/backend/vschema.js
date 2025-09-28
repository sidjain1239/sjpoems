import mongoose from 'mongoose';
const { Schema } = mongoose;

const videoDetailsSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  video: { type: String, required: true },
  likes: { type: Number, },

});

const Data = mongoose.models['video'] || mongoose.model('video', videoDetailsSchema);
export default Data;