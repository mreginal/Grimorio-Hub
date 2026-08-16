import {Edit, Heart, Shield, Swords, Trash2 } from 'lucide-react'

import type { Character } from '../../types/character'

interface CharacterCardProps {
  character: Character
  onEdit?: (character: Character) => void
  onDelete?: (id: string) => void
  onView?: (character: Character) => void
}

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  onView,
}: CharacterCardProps) {
  console.log('Personagem:', character)
  console.log('Imagem:', character.imageUrl)
  return (
    <article className="character-card">

      <div className="character-card-image">
        <img
          src={
            character.imageUrl ||
            'https://w0.peakpx.com/wallpaper/734/429/HD-wallpaper-violet-background-abstract-color.jpg'
          }
          alt={character.name}
        />

        <span className="character-level">
          Nível {character.level}
        </span>

        <div className="character-card-actions">

          {onEdit && (
            <button onClick={() => onEdit(character)} title="Editar"> 
              <Edit size={16} />
            </button>
          )}
          
          {onDelete && (
            <button onClick={() => onDelete(character.id)} title="Excluir"> 
              <Trash2 size={16} />
            </button>
          )}

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

        {onView && (
          <button className="character-view-button" onClick={() => onView(character)}>
            Visualizar
          </button>
        )}

      </div>
    </article>
  )
}