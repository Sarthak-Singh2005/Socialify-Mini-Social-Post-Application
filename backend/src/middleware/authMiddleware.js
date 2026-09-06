import jwt from 'jsonwebtoken'

// Verify the bearer token and attach its user payload to the request.
export default function authMiddleware(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' })
  try {
    // Attach the verified JWT payload so protected controllers know the current user.
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}
