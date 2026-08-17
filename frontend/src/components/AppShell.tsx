import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaCompass, FaHome, FaTheaterMasks, FaUser } from 'react-icons/fa'
import { FaMessage } from 'react-icons/fa6'
import { IoSettingsSharp } from 'react-icons/io5'
import { LogOut, Sparkle } from 'lucide-react'

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Início', icon: FaHome },
    { to: '/characters', label: 'Personagens', icon: FaTheaterMasks },
    { to: '/parties', label: 'Minhas Parties', icon: FaUser },
    { to: '/buscar', label: 'Descobrir', icon: FaCompass },
    { to: '/comunidade', label: 'Comunidade', icon: FaMessage },
    { to: '/configuracao', label: 'Configurações', icon: IoSettingsSharp },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to={"/"}>
          <div className="brand">
            <div className="brand-mark">
              <img src="/grimorio-logo-white.png" alt="logo" />
            </div>
            <div>
              <strong style={{fontSize:17}}>Grimorio Hub</strong>
              <span>Sua jornada começa aqui</span>
            </div>
          </div>
        </Link>

        
          <Link to="/profile">
            <div className="profile-mini">
              <div className="avatar">{(user?.displayName || user?.email || 'U')[0].toUpperCase()}</div>
              <div>
                <strong>{user?.displayName || 'Aventureiro'}</strong>
                <span>{user?.email}</span>
              </div>
            </div>
          </Link>
        

        <nav className="nav-list">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={label} to={to} end={to === "/"} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}