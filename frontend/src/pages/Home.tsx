import { useEffect, useState } from 'react'
import { ChevronRight, Plus, Sparkles } from 'lucide-react'
import { IoNotifications } from 'react-icons/io5'
import { Link } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { getCharacters } from '../services/characterService'
import type { Character } from '../types/character'
import { CharacterCard } from '../components/Characters/CharacterCard'

export function Home() {
  const { user } = useAuth()

  const name =
    user?.displayName?.split(' ')[0] || 'Aventureiro'

  const [characters, setCharacters] =
    useState<Character[]>([])

  const [search, setSearch] =
    useState('')

  useEffect(() => {
    async function loadCharacters() {
      if (!user) return

      try {
        const token = await user.getIdToken()

        const data = await getCharacters(token)

        setCharacters(data)
      } catch (error) {
        console.error(
          'Erro ao carregar personagens:',
          error
        )
      }
    }

    loadCharacters()
  }, [user])

  const filteredCharacters =
    characters.filter(character => {
      const text = `
        ${character.name}
        ${character.race}
        ${character.className}
      `

      return text
        .toLowerCase()
        .includes(search.toLowerCase())
    })

  return (
    <div className="dashboard">
      <header className="topbar">
        <div>
          <span className="eyebrow">
            Painel principal
          </span>

          <h1>
            Olá, {name}!
          </h1>
        </div>

        <div className="top-actions">
          <button
            className="icon-button"
            title="Notificações"
          >
            <IoNotifications />
          </button>

          <div className="avatar large">
            {(name[0] || 'U').toUpperCase()}
          </div>

        </div>
      </header>

      <section className="hero-banner">
        <div>
          <span className="eyebrow">
            <Sparkles size={14} />
            GRIMORIO HUB
          </span>

          <h2>
            Sua próxima grande aventura
            começa aqui.
          </h2>

          <p>
            Gerencie suas campanhas,
            personagens e sessões
            em um só lugar.
          </p>

        </div>

        <Link
          to="/parties/create"
          className="primary-button compact"
        >
          <Plus size={17} />
          Criar Party
        </Link>

      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">
              Campanhas
            </span>

            <h2>
              Suas Parties
            </h2>
          </div>

          <Link
            to="/parties"
            className="text-button"
          >
            Ver todas
            <ChevronRight size={16} />
          </Link>

        </div>


        <div className="party-grid">
          <Link
            to="/parties/create"
            className="create-card"
          >
            <Plus size={25} />

            <strong>
              Criar Party
            </strong>

            <span>
              Comece uma nova campanha
            </span>

          </Link>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                Agenda
              </span>

              <h2>
                Próximas sessões
              </h2>

            </div>
          </div>

          <div className="empty-state">
            <p>
              Nenhuma sessão agendada.
            </p>
          </div>
        </div>

        <div className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                Coleção
              </span>
              <h2>
                Personagens recentes
              </h2>
            </div>
            <Link
              to="/characters"
              className="text-button">
              Ver todos
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="character-list-home">
          {filteredCharacters.length > 0 ? (
              filteredCharacters
                .slice(0, 2)
                .map(character => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    onView={() => {}}
                  />
                ))
            ) : (
              <div className="empty-state">
                <p>
                  Nenhum personagem encontrado.
                </p>
                <Link
                  to="/characters"
                  className="primary-button"
                >
                  <Plus size={17} />
                  Criar personagem
                </Link>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  )
}