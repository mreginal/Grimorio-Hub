import {
  Edit,
  Eye,
  Shield,
  Trash2,
  Sword,
} from 'lucide-react'

import type { Character } from '../../types/character'

interface CharacterCardProps {
  character: Character
  onEdit?: (character: Character) => void
  onDelete?: (id: string) => void
  onView?: (character: Character) => void
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80'

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  onView,
}: CharacterCardProps) {

  const image =
    character.imagemUrl?.trim() ||
    FALLBACK_IMAGE

  return (
    <article className="character-card">

      {/* IMAGEM */}

      <div className="character-card-image">

        <img
          src={image}
          alt={`Personagem ${character.nome}`}
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE
          }}
        />

        <div className="character-card-overlay" />

        {/* NEX */}

        <span className="character-level">
          NEX {character.nex}%
        </span>

        {/* AÇÕES */}

        <div className="character-card-actions">

          {onEdit && (
            <button
              type="button"
              title="Editar personagem"
              onClick={() => onEdit(character)}
            >
              <Edit size={15} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              title="Excluir personagem"
              onClick={() => onDelete(character.id)}
            >
              <Trash2 size={15} />
            </button>
          )}

        </div>

        {/* INFO SOBRE A IMAGEM */}

        <div className="character-card-image-info">

          <span>
            {character.classe || 'Classe não definida'}
          </span>

          <h3>
            {character.nome}
          </h3>

          <p>
            {character.origem || 'Origem não definida'}
          </p>

        </div>

      </div>


      {/* CONTEÚDO */}

      <div className="character-card-content">

        <div className="character-card-meta">

          <span>
            {character.patente || 'Recruta'}
          </span>

          <span>
            NEX {character.nex}%
          </span>

        </div>


        {/* ATRIBUTOS */}

        <div className="character-stats">

          <div>
            <strong>
              {character.atributos.forca}
            </strong>

            <small>
              FOR
            </small>
          </div>

          <div>
            <strong>
              {character.atributos.agilidade}
            </strong>

            <small>
              AGI
            </small>
          </div>

          <div>
            <strong>
              {character.atributos.intelecto}
            </strong>

            <small>
              INT
            </small>
          </div>

          <div>
            <strong>
              {character.atributos.presenca}
            </strong>

            <small>
              PRE
            </small>
          </div>

          <div>
            <strong>
              {character.atributos.vigor}
            </strong>

            <small>
              VIG
            </small>
          </div>

        </div>


        {/* SAÚDE */}

        <div className="character-resources">

          <div>
            <Shield size={14} />

            <span>
              <strong>
                {character.saude.pvAtual}
              </strong>
              /
              {character.saude.pv}
            </span>

            <small>
              PV
            </small>
          </div>

          <div>
            <span>
              <strong>
                {character.saude.sanAtual}
              </strong>
              /
              {character.saude.san}
            </span>

            <small>
              SAN
            </small>
          </div>

          <div>
            <Sword size={14} />

            <span>
              <strong>
                {character.saude.peAtual}
              </strong>
              /
              {character.saude.pe}
            </span>

            <small>
              PE
            </small>
          </div>

        </div>


        {/* BOTÃO */}

        {onView && (
          <button
            type="button"
            className="character-view-button"
            onClick={() => onView(character)}
          >
            <Eye size={15} />

            Ver ficha completa
          </button>
        )}

      </div>

    </article>
  )
}