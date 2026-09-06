import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        username: String(form.username || '').trim(),
        email: String(form.email || '').trim(),
        password: String(form.password || '').trim()
      }

      const { data } = await api.post('/auth/signup', payload)
      login(data)
      navigate('/')
    } catch (err) { setError(err.response?.data?.message || 'Signup failed') }
  }

  return (
    <main className="auth-page">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%' }}>
        <Link className="brand" to="/">Socialify</Link>
        <form className="card auth-form" onSubmit={submit}>
          <h1>Create account</h1>
          {error && <p className="error">{error}</p>}
          <input placeholder="Username" required value={form.username} onChange={e => setForm({...form,username:e.target.value})} />
          <input placeholder="Email" type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
          <input placeholder="Password" type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
          <button>Sign up</button>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </main>
  )
}
