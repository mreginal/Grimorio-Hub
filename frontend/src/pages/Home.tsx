import { CalendarDays, ChevronRight, Plus, Sparkles, Swords, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { IoNotifications } from 'react-icons/io5'
import { useState } from 'react'
import { Character } from '../types/character'
import { Link } from 'react-router-dom'

export function Home() {
  const { user } = useAuth()
  const name = user?.displayName?.split(' ')[0] || 'Aventureiro'
  const [characters, setCharacters] = useState<Character[]>([])
    const [search, setSearch] = useState('')

  const filteredCharacters =
    characters.filter(character => {

      const text =
        `${character.name}
         ${character.race}
         ${character.className}`

      return text
        .toLowerCase()
        .includes(search.toLowerCase())
    })

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <span className="eyebrow">Painel principal</span>
          <h1>Olá, {name}!</h1>
        </div>
        <div className="top-actions">
          <button className="icon-button" title="Notificações"><IoNotifications/></button>
          <div className="avatar large">{(name[0] || 'U').toUpperCase()}</div>
        </div>
      </header>

      <section className="hero-banner">
        <div>
          <span className="eyebrow"><Sparkles size={14} /> GRIMORIO HUB</span>
          <h2>Sua próxima grande aventura começa aqui.</h2>
          <p>Gerencie suas campanhas, personagens e sessões em um só lugar.</p>
        </div>
        <button className="primary-button compact"><Plus size={17} /> Criar Party</button>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Campanhas</span>
            <h2>Suas Parties</h2>
          </div>
          <button className="text-button">Ver todas <ChevronRight size={16} /></button>
        </div>

        <div className="party-grid">
          <button className="create-card">
            <Plus size={25} />
            <strong>Criar Party</strong>
            <span>Comece uma nova campanha</span>
          </button>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="section-heading">
            <div><span className="eyebrow">Agenda</span><h2>Próximas sessões</h2></div>
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div><span className="eyebrow">Coleção</span><h2>Personagens</h2></div>
            <button className="text-button">
              <Link to={"/characters"}>Ver todos <ChevronRight size={16} /></Link>
            </button>
          </div>
          <div className="character-list">
              
          </div>
        </div>
      </section>
    </div>
  )
}