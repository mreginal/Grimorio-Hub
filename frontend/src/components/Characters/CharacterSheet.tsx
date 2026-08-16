import { X } from "lucide-react"
import { Character } from "../../types/character"

export function CharacterSheet({
  character,
  onClose,
  onEdit,
}: {
  character: Character
  onClose: () => void
  onEdit: () => void
}) {

  return (

    <div className="modal-overlay">

      <div className="character-sheet">

        <header className="modal-header">

          <div>

            <span className="page-label">
              FICHA DO PERSONAGEM
            </span>

            <h2>{character.name}</h2>

          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>

        </header>

        <div className="sheet-content">

          <div className="sheet-profile">

            <div
              className="sheet-avatar"
              style={{
                backgroundImage: `url(${
                  character.imageUrl ||
                  'https://images.unsplash.com/photo-1577083552431-6e5fd01988a5?auto=format&fit=crop&w=500&q=80'
                })`,
              }}
            />

            <div>

              <span>
                {character.race}
                {' · '}
                {character.className}
              </span>

              <h1>
                {character.name}
              </h1>

              <p>
                Nível {character.level}
                {' · '}
                {character.alignment}
              </p>

            </div>

          </div>

          <div className="sheet-stat-grid">

            <Stat
              label="HP"
              value={`${character.hp}/${character.maxHp}`}
            />

            <Stat
              label="CA"
              value={character.armorClass}
            />

            <Stat
              label="INIT"
              value={character.initiative}
            />

            <Stat
              label="FOR"
              value={character.strength}
            />

            <Stat
              label="DES"
              value={character.dexterity}
            />

            <Stat
              label="CON"
              value={character.constitution}
            />

            <Stat
              label="INT"
              value={character.intelligence}
            />

            <Stat
              label="SAB"
              value={character.wisdom}
            />

            <Stat
              label="CAR"
              value={character.charisma}
            />

          </div>

          <div className="sheet-columns">

            <div>

              <h3>História</h3>

              <p>
                {character.backstory ||
                  'Nenhuma história registrada.'}
              </p>

              <h3>Habilidades</h3>

              <List
                items={character.abilities}
              />

            </div>

            <div>

              <h3>Magias</h3>

              <List
                items={character.spells}
              />

              <h3>Inventário</h3>

              <List
                items={character.inventory}
              />

            </div>

          </div>

        </div>

        <footer className="modal-footer">

          <button
            className="secondary-button"
            onClick={onClose}
          >
            Fechar
          </button>

          <button
            className="primary-button"
            onClick={onEdit}
          >
            Editar personagem
          </button>

        </footer>

      </div>

    </div>
  )
}

function Stat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {

  return (

    <div className="sheet-stat">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  )
}

function List({
  items,
}: {
  items: string[]
}) {

  if (!items.length) {

    return (
      <p className="empty-list">
        Nenhum item registrado.
      </p>
    )
  }

  return (

    <div className="sheet-list">

      {items.map((item, index) => (

        <span key={index}>
          {item}
        </span>

      ))}

    </div>
  )
}