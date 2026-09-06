import Post from '../models/Post.js'

const FEED_SORTS = {
  all: { createdAt: -1, _id: -1 },
  // Stable tie-breakers keep pagination deterministic when posts have equal counts.
  mostliked: { likesCount: -1, createdAt: -1, _id: -1 },
  mostcomment: { commentsCount: -1, createdAt: -1, _id: -1 },
}

// Convert query parameters into safe values for paginated database queries.
function getPagination(query) {
  // Clamp pagination values so clients cannot request invalid or oversized pages.
  const page = Math.max(Number(query.page) || 1, 1)
  const limit = Math.min(Math.max(Number(query.limit) || 6, 1), 20)
  return { page, limit, skip: (page - 1) * limit }
}

// Return a sorted page of posts and indicate whether another page exists.
export async function getPosts(req, res) {
  try {
    const feed = req.params.all
    if (!FEED_SORTS[feed]) return res.status(400).json({ message: 'Invalid feed type' })

    const { page, limit, skip } = getPagination(req.query)
    const total = await Post.countDocuments()
    const posts = feed === 'all'
      ? await Post.find().sort(FEED_SORTS.all).skip(skip).limit(limit)
      : await Post.aggregate([
        { $addFields: { likesCount: { $size: '$likes' }, commentsCount: { $size: '$comments' } } },
        { $sort: FEED_SORTS[feed] },
        { $skip: skip },
        { $limit: limit },
      ])

    return res.json({ posts, page, limit, total, hasMore: page * limit < total })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// Validate and save a text or image post for the authenticated user.
export async function createPost(req, res) {
  try {
    const text = String(req.body.text || '').trim()
    const image = String(req.body.image || '').trim()
    if (!text && !image) return res.status(400).json({ message: 'Text or image is required' })
    if (image.startsWith('data:') && image.length > 3 * 1024 * 1024) {
      return res.status(413).json({ message: 'Embedded image must be 3MB or smaller.' })
    }
    const post = await Post.create({ user: req.user.id, username: req.user.username, text, image })
    res.status(201).json(post)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// Add or remove the authenticated user's like and return the updated post.
export async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    // A like is a toggle: remove the current user if present, otherwise add them.
    const index = post.likes.findIndex(id => id.toString() === req.user.id)
    if (index >= 0) {
      post.likes.splice(index, 1)
      post.likedUsernames = post.likedUsernames.filter(name => name !== req.user.username)
    } else {
      post.likes.push(req.user.id)
      post.likedUsernames.push(req.user.username)
    }
    await post.save()
    res.json(post)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

// Validate and append a comment to the requested post.
export async function addComment(req, res) {
  try {
    const { text } = req.body
    // Comments are embedded in posts to keep the application within its two-collection design.
    if (!text?.trim()) return res.status(400).json({ message: 'Comment is required' })
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: 'Post not found' })
    post.comments.push({ user: req.user.id, username: req.user.username, text: text.trim() })
    await post.save()
    res.json(post)
  } catch (err) { res.status(500).json({ message: err.message }) }
}
