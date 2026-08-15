import {
  Edit,
  Heart,
  Shield,
  Swords,
  Trash2,
} from 'lucide-react'

import type { Character } from '../types/character'

interface CharacterCardProps {
  character: Character
  onEdit: (character: Character) => void
  onDelete: (id: string) => void
  onView: (character: Character) => void
}

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  onView,
}: CharacterCardProps) {
  return (
    <article className="character-card">

      <div
        className="character-card-image"
        style={{
          backgroundImage: `url(${
            character.imageUrl ||
            'https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=800&q=80'
          })`,
        }}
      >

        <span className="character-level">
          Nível {character.level}
        </span>

        <div className="character-card-actions">

          <button
            onClick={() => onEdit(character)}
            title="Editar"
          >
            <Edit size={16} />
          </button>

          <button
            onClick={() => onDelete(character.id)}
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>

        </div>
      </div>

      <div className="character-card-content">

        <span className="character-class">
          {character.race} · {character.className}
        </span>

        <h3>{character.name}</h3>

        <p>
          {character.description ||
            'Um aventureiro pronto para começar sua jornada.'}
        </p>

        <div className="character-stats">

          <div>
            <Heart size={14} />
            <span>{character.hp}/{character.maxHp}</span>
            <small>HP</small>
          </div>

          <div>
            <Shield size={14} />
            <span>{character.armorClass}</span>
            <small>CA</small>
          </div>

          <div>
            <Swords size={14} />
            <span>
              {character.initiative >= 0
                ? `+${character.initiative}`
                : character.initiative}
            </span>
            <small>INIT</small>
          </div>

        </div>

        <button
          className="character-view-button"
          onClick={() => onView(character)}
        >
          Ver ficha
        </button>

      </div>
    </article>
  )
}