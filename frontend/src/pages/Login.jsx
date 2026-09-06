import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
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
          <input placeholder="Email" type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})} />
          <input placeholder="Password" type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})} />
          <button>Login</button>
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </form>
      </div>
    </main>
  )
}
