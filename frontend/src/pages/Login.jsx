import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      navigate('/')
    } catch (err) { setError(err.response?.data?.message || 'Login failed') }
  }

  return (
    <main className="auth-page">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: '100%' }}>
        <Link className="brand" to="/">Socialify</Link>
        <form className="card auth-form" onSubmit={submit}>
          <h1>Welcome back</h1>
          {error && <p className="error">{error}</p>}
          <input placeholder="Email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div className="password-field">
            <input placeholder="Password" type={showPassword ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <button className="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                {showPassword ? <circle cx="12" cy="12" r="2.5" /> : <path d="m4 4 16 16" />}
              </svg>
            </button>
          </div>
          <button>Login</button>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </form>
      </div>
    </main>
  )
}
