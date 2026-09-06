import { useState } from 'react'
import api from '../services/api'
import { uploadImage } from '../services/upload'

export default function CreatePost({ onCreated }) {
  const [text, setText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function chooseFile(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/')) return setError('Please choose an image file.')
    if (selected.size > 5 * 1024 * 1024) return setError('Image must be 5MB or smaller before compression.')
    setError('')
    if (preview) URL.revokeObjectURL(preview)
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  function removeImage() {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview('')
    setImageUrl('')
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!text.trim() && !file && !imageUrl.trim()) return setError('Add text or an image.')
    setLoading(true)
    try {
      let image = imageUrl.trim()
      if (file) image = await uploadImage(file)
      const { data } = await api.post('/posts', { text, image })
      if (preview) URL.revokeObjectURL(preview)
      setText(''); setImageUrl(''); setFile(null); setPreview('')
      onCreated(data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not create post')
    } finally { setLoading(false) }
  }

  return (
    <form className="card composer" onSubmit={submit}>
      <div className="composer-title">Create post</div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What's on your mind?" />
      {(preview || imageUrl) && (
        <>
          <img className="composer-preview" src={preview || imageUrl} alt="Preview" />
          <button type="button" className="remove-image" onClick={removeImage}>Remove image</button>
        </>
      )}
      <div className="composer-tools">
        <label className="upload-btn">📷 Add image<input type="file" accept="image/*" onChange={chooseFile} hidden /></label>

        <button disabled={loading}>{loading ? 'Posting…' : '➤ Post'}</button>
      </div>

      {error && <div className="error">{error}</div>}
    </form>
  )
}
