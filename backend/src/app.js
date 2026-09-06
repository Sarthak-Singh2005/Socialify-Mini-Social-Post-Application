import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'

const app = express()
const allowedOrigins = (process.env.FRONTEND_URL || '')
	.split(',')
	.map(origin => origin.trim())
	.filter(Boolean)

app.use(cors({
	origin: allowedOrigins.length ? allowedOrigins : true
}))
app.use(express.json({ limit: '10mb' }))

// Expose a lightweight endpoint for deployment and uptime checks.
app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)

export default app