import { useEffect, useState } from 'react'

import {
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'

import {
  createCharacter,
  deleteCharacter,
  generateCharacter,
  getCharacters,
  updateCharacter,
} from '../services/characterService'

import type {
  Character,
  CreateCharacterData,
} from '../types/character'

import { CharacterCard } from '../components/CharacterCard'
import { AIModal } from '../components/AIModal'
import { CharacterSheet } from '../components/CharacterSheet'


const emptyCharacter: CreateCharacterData = {
  name: '',
  race: '',
  className: '',

  level: 1,

  background: '',
  alignment: '',

  description: '',
  backstory: '',

  imageUrl: '',

  hp: 10,
  maxHp: 10,

  armorClass: 10,
  initiative: 0,

  strength: 10,
  dexterity: 10,
  constitution: 10,
  intelligence: 10,
  wisdom: 10,
  charisma: 10,

  abilities: [],
  spells: [],
  inventory: [],
}

export function Characters() {

  const { user } = useAuth()

  const [characters, setCharacters] =
    useState<Character[]>([])

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [modal, setModal] =
    useState<'create' | 'edit' | 'ai' | 'view' | null>(null)

  const [selectedCharacter, setSelectedCharacter] =
    useState<Character | null>(null)

  const [form, setForm] =
    useState<CreateCharacterData>(emptyCharacter)

  const [error, setError] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  async function loadCharacters() {

    if (!user) return

    try {

      setLoading(true)

      const token =
        await user.getIdToken()

      const data =
        await getCharacters(token)

      setCharacters(data)

    } catch (error) {

      console.error(error)

      setError(
        'Não foi possível carregar seus personagens.'
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    loadCharacters()
  }, [user])

  function openCreate() {

    setSelectedCharacter(null)

    setForm({
      ...emptyCharacter,
      abilities: [],
      spells: [],
      inventory: [],
    })

    setModal('create')
  }

  function openEdit(character: Character) {

    setSelectedCharacter(character)

    setForm({
      ...character,
    })

    setModal('edit')
  }

  function openView(character: Character) {

    setSelectedCharacter(character)

    setModal('view')
  }

  async function handleDelete(id: string) {

    if (!user) return

    const confirmed =
      window.confirm(
        'Deseja realmente excluir este personagem?'
      )

    if (!confirmed) return

    try {

      const token =
        await user.getIdToken()

      await deleteCharacter(id, token)

      setCharacters(
        current =>
          current.filter(
            character => character.id !== id
          )
      )

    } catch {

      setError(
        'Não foi possível excluir o personagem.'
      )
    }
  }

  async function handleSave(
    event: React.FormEvent
  ) {

    event.preventDefault()

    if (!user) return

    try {

      setSaving(true)

      const token =
        await user.getIdToken()

      if (
        modal === 'edit' &&
        selectedCharacter
      ) {

        const updated =
          await updateCharacter(
            selectedCharacter.id,
            form,
            token
          )

        setCharacters(
          current =>
            current.map(character =>
              character.id === updated.id
                ? updated
                : character
            )
        )

      } else {

        const created =
          await createCharacter(
            form,
            token
          )

        setCharacters(
          current => [
            created,
            ...current,
          ]
        )
      }

      setModal(null)

    } catch (error) {

      console.error(error)

      setError(
        'Não foi possível salvar o personagem.'
      )

    } finally {

      setSaving(false)
    }
  }

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

    <div className="characters-page">

      <header className="characters-header">

        <div>

          <span className="page-label">
            SUA COLEÇÃO
          </span>

          <h1>
            Meus Personagens
          </h1>

          <p>
            Crie, organize e prepare seus
            personagens para qualquer aventura.
          </p>

        </div>

        <div className="characters-header-actions">

          <button
            className="secondary-button"
            onClick={() => setModal('ai')}
          >
            <Sparkles size={16} />
            Criar com IA
          </button>

          <button
            className="primary-button"
            onClick={openCreate}
          >
            <Plus size={16} />
            Novo personagem
          </button>

        </div>

      </header>

      <div className="characters-toolbar">

        <div className="characters-search">

          <Search size={17} />

          <input
            value={search}
            onChange={event =>
              setSearch(event.target.value)
            }
            placeholder="Buscar personagem..."
          />

        </div>

        <span>
          {characters.length} personagens
        </span>

      </div>

      {error && (

        <div className="characters-error">

          {error}

          <button
            onClick={() => setError('')}
          >
            <X size={16} />
          </button>

        </div>

      )}

      {loading ? (

        <div className="characters-loading">
          Carregando personagens...
        </div>

      ) : filteredCharacters.length === 0 ? (

        <div className="characters-empty">

          <Sparkles size={35} />

          <h2>
            Nenhum personagem encontrado
          </h2>

          <p>
            Crie seu primeiro personagem
            para começar sua aventura.
          </p>

          <button
            className="primary-button"
            onClick={openCreate}
          >
            <Plus size={16} />
            Criar personagem
          </button>

        </div>

      ) : (

        <div className="characters-grid">

          {filteredCharacters.map(character => (

            <CharacterCard
              key={character.id}
              character={character}
              onEdit={openEdit}
              onDelete={handleDelete}
              onView={openView}
            />

          ))}

          <button
            className="character-add-card"
            onClick={openCreate}
          >

            <Plus size={30} />

            <strong>
              Novo personagem
            </strong>

            <span>
              Criar uma nova ficha
            </span>

          </button>

        </div>

      )}

      {(modal === 'create' ||
        modal === 'edit') && (

        <CharacterFormModal
          title={
            modal === 'edit'
              ? 'Editar personagem'
              : 'Novo personagem'
          }
          form={form}
          setForm={setForm}
          onClose={() => setModal(null)}
          onSubmit={handleSave}
          saving={saving}
        />

      )}

      {modal === 'ai' && (

        <AIModal
          onClose={() => setModal(null)}
          onGenerate={async prompt => {

            if (!user) return

            try {

              const token =
                await user.getIdToken()

              const generated =
                await generateCharacter(
                  prompt,
                  token
                )

              setForm({
                ...emptyCharacter,
                ...generated,
              })

              setModal('create')

            } catch {

              setError(
                'Não foi possível gerar o personagem.'
              )
            }
          }}
        />

      )}

      {modal === 'view' &&
        selectedCharacter && (

          <CharacterSheet
            character={selectedCharacter}
            onClose={() => setModal(null)}
            onEdit={() =>
              openEdit(selectedCharacter)
            }
          />

        )}

    </div>
  )
}

interface CharacterFormModalProps {
  title: string
  form: CreateCharacterData
  setForm: React.Dispatch<
    React.SetStateAction<CreateCharacterData>
  >
  onClose: () => void
  onSubmit: (event: React.FormEvent) => void
  saving: boolean
}

function CharacterFormModal({
  title,
  form,
  setForm,
  onClose,
  onSubmit,
  saving,
}: CharacterFormModalProps) {

  function update(
    field: keyof CreateCharacterData,
    value: any
  ) {

    setForm(current => ({
      ...current,
      [field]: value,
    }))
  }

  return (

    <div className="modal-overlay">

      <div className="character-modal">

        <header className="modal-header">

          <h2>{title}</h2>

          <button onClick={onClose}>
            <X size={18} />
          </button>

        </header>

        <form onSubmit={onSubmit}>

          <section>

            <h3>Identidade</h3>

            <div className="form-grid">

              <label>
                Nome

                <input
                  value={form.name}
                  required
                  onChange={e =>
                    update(
                      'name',
                      e.target.value
                    )
                  }
                />

              </label>

              <label>
                Raça

                <input
                  value={form.race}
                  onChange={e =>
                    update(
                      'race',
                      e.target.value
                    )
                  }
                />

              </label>

              <label>
                Classe

                <input
                  value={form.className}
                  onChange={e =>
                    update(
                      'className',
                      e.target.value
                    )
                  }
                />

              </label>

              <label>
                Nível

                <input
                  type="number"
                  min="1"
                  value={form.level}
                  onChange={e =>
                    update(
                      'level',
                      Number(e.target.value)
                    )
                  }
                />

              </label>

              <label>
                Antecedente

                <input
                  value={form.background}
                  onChange={e =>
                    update(
                      'background',
                      e.target.value
                    )
                  }
                />

              </label>

              <label>
                Alinhamento

                <input
                  value={form.alignment}
                  onChange={e =>
                    update(
                      'alignment',
                      e.target.value
                    )
                  }
                />

              </label>

            </div>

          </section>

          <section>

            <h3>Descrição</h3>

            <label>
              Resumo

              <textarea
                value={form.description}
                onChange={e =>
                  update(
                    'description',
                    e.target.value
                  )
                }
              />

            </label>

            <label>
              História

              <textarea
                rows={5}
                value={form.backstory}
                onChange={e =>
                  update(
                    'backstory',
                    e.target.value
                  )
                }
              />

            </label>

          </section>

          <section>

            <h3>Atributos</h3>

            <div className="attribute-grid">

              {[
                ['strength', 'FOR'],
                ['dexterity', 'DES'],
                ['constitution', 'CON'],
                ['intelligence', 'INT'],
                ['wisdom', 'SAB'],
                ['charisma', 'CAR'],
              ].map(([field, label]) => (

                <label key={field}>

                  {label}

                  <input
                    type="number"
                    value={
                      form[
                        field as keyof CreateCharacterData
                      ] as number
                    }
                    onChange={e =>
                      update(
                        field as keyof CreateCharacterData,
                        Number(e.target.value)
                      )
                    }
                  />

                </label>

              ))}

            </div>

          </section>

          <section>

            <h3>Combate</h3>

            <div className="form-grid">

              <label>
                HP atual

                <input
                  type="number"
                  value={form.hp}
                  onChange={e =>
                    update(
                      'hp',
                      Number(e.target.value)
                    )
                  }
                />

              </label>

              <label>
                HP máximo

                <input
                  type="number"
                  value={form.maxHp}
                  onChange={e =>
                    update(
                      'maxHp',
                      Number(e.target.value)
                    )
                  }
                />

              </label>

              <label>
                Classe de Armadura

                <input
                  type="number"
                  value={form.armorClass}
                  onChange={e =>
                    update(
                      'armorClass',
                      Number(e.target.value)
                    )
                  }
                />

              </label>

              <label>
                Iniciativa

                <input
                  type="number"
                  value={form.initiative}
                  onChange={e =>
                    update(
                      'initiative',
                      Number(e.target.value)
                    )
                  }
                />

              </label>

            </div>

          </section>

          <section>

            <h3>Recursos</h3>

            <label>
              Habilidades

              <textarea
                placeholder="Uma habilidade por linha"
                value={form.abilities.join('\n')}
                onChange={e =>
                  update(
                    'abilities',
                    e.target.value
                      .split('\n')
                      .filter(Boolean)
                  )
                }
              />

            </label>

            <label>
              Magias

              <textarea
                placeholder="Uma magia por linha"
                value={form.spells.join('\n')}
                onChange={e =>
                  update(
                    'spells',
                    e.target.value
                      .split('\n')
                      .filter(Boolean)
                  )
                }
              />

            </label>

            <label>
              Inventário

              <textarea
                placeholder="Um item por linha"
                value={form.inventory.join('\n')}
                onChange={e =>
                  update(
                    'inventory',
                    e.target.value
                      .split('\n')
                      .filter(Boolean)
                  )
                }
              />

            </label>

          </section>

          <section>

            <h3>Imagem</h3>

            <label>

              URL da imagem

              <input
                value={form.imageUrl || ''}
                onChange={e =>
                  update(
                    'imageUrl',
                    e.target.value
                  )
                }
              />

            </label>

          </section>

          <footer className="modal-footer">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={saving}
            >
              {saving
                ? 'Salvando...'
                : 'Salvar personagem'}
            </button>

          </footer>

        </form>

      </div>

    </div>
  )
}