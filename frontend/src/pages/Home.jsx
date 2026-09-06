import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [category, setCategory] = useState("all")
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  async function loadPosts(nextPage = 1) {
    setError('')
    // Keep the existing feed visible while only subsequent pages are loading.
    if (nextPage === 1) {
      setInitialLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const { data } = await api.get(`/posts/${category}?page=${nextPage}&limit=6`)
      setPosts(currentPosts => nextPage === 1 ? data.posts : [...currentPosts, ...data.posts])
      setHasMore(data.hasMore)
      setPage(nextPage)
    } catch {
      setError('Could not load posts. Please try again.')
    } finally {
      if (nextPage === 1) {
        setInitialLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }

  useEffect(() => {
    // Changing the sort starts a fresh paginated feed.
    setPosts([])
    loadPosts(1)
  }, [category])

  function created(post) { setPosts(currentPosts => [post, ...currentPosts]) }
  function updated(post) { setPosts(currentPosts => currentPosts.map(p => p._id === post._id ? post : p)) }

  return (
    <>
      <Navbar />
      <main className="feed">
        <CreatePost onCreated={created} />
        <div className='post-category'>
          <button className={`post-type ${category === 'all' ? 'active' : ''}`} onClick={() => setCategory("all")}>All Post</button>
          <button className={`post-type ${category === 'mostliked' ? 'active' : ''}`} onClick={() => setCategory("mostliked")}>Most Liked</button>
          <button className={`post-type ${category === 'mostcomment' ? 'active' : ''}`} onClick={() => setCategory("mostcomment")}>Most Commented</button>
        </div>
        {error && <div className="error" role="alert">{error}</div>}
        {initialLoading ? <div className="loading">Loading posts…</div> :
          posts.map(post => <PostCard key={post._id} post={post} currentUser={user} onUpdated={updated} />)}
        {!initialLoading && posts.length === 0 && <div className="card empty">No posts yet. Be the first to share something!</div>}
        {hasMore && <button className="load-more" onClick={() => loadPosts(page + 1)} disabled={loadingMore}>{loadingMore ? 'Loading…' : 'Load more'}</button>}
        {loadingMore && posts.length > 0 && <div className="loading">Loading more posts…</div>}
      </main>
    </>
  )
}
