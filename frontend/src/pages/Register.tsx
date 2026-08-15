import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Dice5, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    if (password.length < 6) return setError('A senha precisa ter pelo menos 6 caracteres.')
    if (password !== confirm) return setError('As senhas não coincidem.')

    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/')
    } catch {
      setError('Não foi possível criar a conta. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-art register-art">
        <div className="auth-brand">
          <img src="/grimorio-logo-white.png" alt="logo" />
          Grimorio Hub
        </div>
        <div className="auth-copy">
          <span className="eyebrow"><Sparkles size={14} /> Comece sua jornada</span>
          <h1>Seu personagem,<br /><em>Nosso legado.</em></h1>
          <p>Crie seu perfil, monte seus personagens e encontre sua próxima party.</p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <span className="eyebrow">Novo aventureiro</span>
          <h2>Criar sua conta</h2>
          <p className="muted">Leva menos de um minuto.</p>

          <form onSubmit={handleSubmit} className="form">
            <label>
              Nome/Apelido
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Como devemos chamar você?" required />
            </label>
            <label>
              E-mail
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="voce@email.com" required />
            </label>
            <label>
              Senha
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres" required />
            </label>
            <label>
              Confirmar senha
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Digite a senha novamente" required />
            </label>

            {error && <div className="error-message">{error}</div>}

            <button className="primary-button" disabled={loading}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          <p className="auth-switch">Já tem uma conta? <Link to="/login">Entrar</Link></p>
        </div>
      </div>
    </div>
  )
}