import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false })

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likedUsernames: [{ type: String }],
  comments: [commentSchema],
}, { timestamps: true })

export default mongoose.model('Post', postSchema)
