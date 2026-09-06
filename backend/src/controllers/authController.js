import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// Create a new user account after validating uniqueness and hashing the password.
export async function signup(req, res) {
  try {
    const username = String(req.body.username || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '').trim()

    if (!username || !email || !password) return res.status(400).json({ message: 'All fields are required' })

    const normalizedUsername = username.toLowerCase()
    const existingUser = await User.findOne({
      $or: [
        { email },
        { username: normalizedUsername }
      ]
    })

    if (existingUser) return res.status(409).json({ message: 'Username or email already exists' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ username: normalizedUsername, email, password: hashed })
    res.status(201).json({ token: generateToken(user), user: { id: user._id, username: user.username, email: user.email } })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// Authenticate a user and return a JWT with their basic profile details.
export async function login(req, res) {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    const user = await User.findOne({ email })
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password' })
    res.json({ token: generateToken(user), user: { id: user._id, username: user.username, email: user.email } })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
