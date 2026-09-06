import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'

const port = process.env.PORT || 5000

connectDB()
  // Start accepting requests only after MongoDB is connected.
  .then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))
  // Fail startup instead of running an API that cannot persist data.
  .catch(err => {
    console.error('Database connection failed:', err)
    process.exit(1)
  })
