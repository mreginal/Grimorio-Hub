import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dice5, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('E-mail ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-art">
        <div className="auth-brand">
          <img src="/grimorio-logo-white.png" alt="logo" />
          Grimorio Hub
        </div>
        <div className="auth-copy">
          <span className="eyebrow"><Sparkles size={14} /> No mundo do RPG</span>
          <h1>Suas aventuras,<br /><em>Nosso propósito.</em></h1>
          <p>Crie personagens, reúna sua party e transforme cada sessão em uma aventura inesquecível.</p>
        </div>
        <div className="quote-card">
          <span>“</span>
          <p>A melhor parte de uma aventura é quem você encontra no caminho.</p>
          <small>— O Mestre</small>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">Bem-vindo(a)</span>
          <h2>Entrar no Grimorio Hub</h2>
          <p className="muted">Continue para sua próxima aventura.</p>

          <form onSubmit={handleSubmit} className="form">
            <label>
              E-mail
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" required />
            </label>

            <label>
              Senha
              <div className="password-field">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(v => !v)} aria-label="Mostrar senha">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && <div className="error-message">{error}</div>}

            <button className="primary-button" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth-switch">Ainda não tem uma conta? <Link to="/cadastro">Criar conta</Link></p>
        </div>
      </div>
    </div>
  )
}