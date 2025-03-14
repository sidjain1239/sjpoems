import mongoose from 'mongoose';
const { Schema } = mongoose;

const poemDetailsSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  filename: { type: String, required: true },
  likes: { type: Number, },

});

const Data = mongoose.models['poem'] || mongoose.model('poem', poemDetailsSchema);
export default Data;