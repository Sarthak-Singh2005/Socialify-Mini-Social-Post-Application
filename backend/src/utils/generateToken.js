import jwt from 'jsonwebtoken'

// Create a seven-day JWT containing the user's identity and username.
export default function generateToken(user) {
  return jwt.sign({ id: user._id.toString(), username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
}
