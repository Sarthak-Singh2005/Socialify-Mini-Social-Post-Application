import mongoose from 'mongoose'

// Connect the application to the configured MongoDB database.
export default async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')
}
