import { useState } from 'react'
import api from '../services/api'

export default function PostCard({ post, currentUser, onUpdated }) {
  const [comment, setComment] = useState('')
  const [seeComments, setSeeComments] = useState(false)
  const [liking, setLiking] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [error, setError] = useState('')
  const liked = post.likes?.some(id => id === currentUser?.id || id?._id === currentUser?.id)

  async function like() {
    // Replace the post returned by the API so the like count and state stay in sync.
    setError('')
    setLiking(true)
    try { const { data } = await api.post(`/posts/${post._id}/like`); onUpdated(data) }
    catch { setError('Could not update the like. Please try again.') }
    finally { setLiking(false) }
  }

  async function addComment(e) {
    e.preventDefault()
    if (!comment.trim()) return
    // The API returns the updated post, allowing the new comment to appear immediately.
    setError('')
    setCommenting(true)
    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: comment })
      setComment('')
      setSeeComments(true)
      onUpdated(data)
    } catch {
      setError('Could not add your comment. Please try again.')
    } finally {
      setCommenting(false)
    }
  }

  return (
    <article className="card post">

      <div className="post-header">
        <div className="avatar">{post.username?.charAt(0).toUpperCase() || 'U'}</div>
        <div><div className="post-user">@{post.username}</div><div className="post-date">{new Date(post.createdAt).toLocaleString()}</div></div>
      </div>
      {post.text && <p className="post-text">{post.text}</p>}
      {post.image && (
        <a className="post-image-link" href={post.image} target="_blank" rel="noreferrer">
          <img className="post-image" src={post.image} alt="Post attachment" loading="lazy" />
        </a>
      )}
      <div className="post-actions">
        <button className={liked ? 'action liked' : 'action'} onClick={like} disabled={liking} aria-label={liked ? 'Unlike post' : 'Like post'}>
          {liked ? '♥' : '♡'} {post.likes?.length || 0}
        </button>
        <button className="action comment-action" onClick={() => setSeeComments(value => !value)} type="button" aria-expanded={seeComments}>
          💬 {post.comments?.length || 0}
        </button>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      {post.comments?.length > 0 && seeComments && <div className="comments">
        {post.comments.map((c, i) => <div className="comment" key={`${c.user}-${c.createdAt}-${i}`}><b>@{c.username}</b><span>{c.text}</span></div>)}
      </div>}
      <form className="comment-form" onSubmit={addComment}>
        <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a comment..." aria-label="Write a comment" disabled={commenting} />
        <button type="submit" disabled={commenting || !comment.trim()}>{commenting ? 'Sending...' : 'Send'}</button>
      </form>
    </article>
  )
}
