import {useEffect,useState,type Dispatch,type FormEvent,type SetStateAction,} from 'react'
import {Plus,Search,Sparkles,X,Trash2,} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {createCharacter,deleteCharacter,generateCharacter,getCharacters,updateCharacter,} from '../services/characterService'
import type { Ability, Character, CharacterAttributes, CreateCharacterData, InventoryItem, Weapon,} from '../types/character'
import { CharacterCard } from '../components/Characters/CharacterCard'
import { AIModal } from '../components/AIModal'
import { CharacterSheet } from '../components/Characters/CharacterSheet'

/* Personagem base */
const emptyCharacter: CreateCharacterData = {
  nome: '',
  jogador: '',
  origem: '',
  classe: '',
  nex: 5,
  patente: 'Recruta',
  atributos: {
    forca: 1,
    agilidade: 1,
    intelecto: 1,
    presenca: 1,
    vigor: 1,
  },
  pericias: {
    atletismo: 0,
    atualidades: 0,
    ciencia: 0,
    diplomacia: 0,
    enganacao: 0,
    fortitude: 0,
    furtividade: 0,
    intimidacao: 0,
    intuicao: 0,
    investigacao: 0,
    luta: 0,
    medicina: 0,
    ocultismo: 0,
    percepcao: 0,
    pilotagem: 0,
    pontaria: 0,
    prestidigitacao: 0,
    profissao: 0,
    reflexos: 0,
    religiao: 0,
    sobrevivencia: 0,
    tatica: 0,
    tecnologia: 0,
    vontade: 0,
  },
  saude: {
    pv: 10,
    pvAtual: 10,

    san: 10,
    sanAtual: 10,

    pe: 5,
    peAtual: 5,
  },

  defesas: {
    passiva: 10,
    bloqueio: 0,
    esquiva: 10,
  },

  resistencias: {
    fisica: 0,
    balistica: 0,

    insanidade: 0,
    sangue: 0,
    morte: 0,
    energia: 0,
    conhecimento: 0,
  },

  armas: [],
  habilidades: [],
  inventario: [],

  descricao: '',
  historia: '',
  imagemUrl: '',
}

/* Atributos */

const ATTRIBUTES: {
  field: keyof CharacterAttributes
  label: string
  short: string
}[] = [
  {
    field: 'forca',
    label: 'Força',
    short: 'FOR',
  },
  {
    field: 'agilidade',
    label: 'Agilidade',
    short: 'AGI',
  },
  {
    field: 'intelecto',
    label: 'Intelecto',
    short: 'INT',
  },
  {
    field: 'presenca',
    label: 'Presença',
    short: 'PRE',
  },
  {
    field: 'vigor',
    label: 'Vigor',
    short: 'VIG',
  },
]

export function Characters() {
  const { user } = useAuth()

  const [characters, setCharacters] =
    useState<Character[]>([])

  const [search, setSearch] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [modal, setModal] =
    useState<
      'create' |
      'edit' |
      'ai' |
      'view' |
      null
    >(null)

  const [selectedCharacter, setSelectedCharacter] =
    useState<Character | null>(null)

  const [form, setForm] =
    useState<CreateCharacterData>(emptyCharacter)

  const [error, setError] =
    useState('')

  const [saving, setSaving] =
    useState(false)

/* Carregar personagens */

  async function loadCharacters() {
    if (!user) {
      setCharacters([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError('')
      const token = await user.getIdToken()
      const data = await getCharacters(token)
      setCharacters(data)
    } catch (err) {
      console.error(err)
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

  /* Novo Personagem */

  function openCreate() {
    setSelectedCharacter(null)

    setForm({
      ...emptyCharacter,

      jogador:
        user?.displayName ||
        user?.email ||
        '',

      atributos: {
        ...emptyCharacter.atributos,
      },

      pericias: {
        ...emptyCharacter.pericias,
      },

      saude: {
        ...emptyCharacter.saude,
      },

      defesas: {
        ...emptyCharacter.defesas,
      },

      resistencias: {
        ...emptyCharacter.resistencias,
      },

      armas: [],
      habilidades: [],
      inventario: [],
    })

    setError('')
    setModal('create')
  }

  /* Editar Personagem */

  function openEdit(character: Character) {
    setSelectedCharacter(character)

    setForm({
      nome: character.nome,
      jogador: character.jogador,

      origem: character.origem,
      classe: character.classe,

      nex: character.nex,
      patente: character.patente,

      atributos: {
        ...character.atributos,
      },

      pericias: {
        ...character.pericias,
      },

      saude: {
        ...character.saude,
      },

      defesas: {
        ...character.defesas,
      },

      resistencias: {
        ...character.resistencias,
      },

      armas: [
        ...(character.armas || []),
      ],

      habilidades: [
        ...(character.habilidades || []),
      ],

      inventario: [
        ...(character.inventario || []),
      ],

      descricao:
        character.descricao || '',

      historia:
        character.historia || '',

      imagemUrl:
        character.imagemUrl || '',
    })

    setError('')
    setModal('edit')
  }

  /* Ver Personagem */

  function openView(character: Character) {
    setSelectedCharacter(character)
    setModal('view')
  }

  /* Apagar personagem */

  async function handleDelete(id: string) {
    if (!user) return
    const confirmed = window.confirm(
      'Deseja realmente excluir este personagem?'
    )

    if (!confirmed) return
    try {
      const token = await user.getIdToken()

      await deleteCharacter(id, token)

      setCharacters(current =>
        current.filter(
          character =>
            character.id !== id
        )
      )
    } catch (err) {
      console.error(err)

      setError(
        'Não foi possível excluir o personagem.'
      )
    }
  }

  /* Salvar Personagem */

    async function handleSave(event: FormEvent) {
    event.preventDefault()

    if (!user) {
      setError('Usuário não autenticado.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const token = await user.getIdToken()

      let savedCharacter: Character

      if (modal === 'edit' && selectedCharacter) {

        savedCharacter = await updateCharacter(
          selectedCharacter.id,
          form,
          token
        )

        setCharacters(current =>
          current.map(character =>
            character.id === savedCharacter.id
              ? savedCharacter
              : character
          )
        )

      } else {
        savedCharacter = await createCharacter(
          form,
          token
        )

        setCharacters(current => [
          savedCharacter,
          ...current,
        ])
      }

      setModal(null)

    } catch (error) {

      console.error(
        'ERRO AO SALVAR PERSONAGEM:',
        error
      )

      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível salvar o personagem.'
      )
    } finally {
      setSaving(false)
    }
  }

  /* Filtro */

  const filteredCharacters =
    characters.filter(character => {
      const text = `
        ${character.nome}
        ${character.origem}
        ${character.classe}
        ${character.patente}
      `

      return text
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
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
            onClick={() =>
              setModal('ai')
            }
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

      {/* BUSCAR */}

      <div className="characters-toolbar">

        <div className="characters-search">

          <Search size={17} />

          <input
            value={search}
            onChange={event =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Buscar personagem..."
          />

        </div>

        <span>
          {characters.length}{' '}
          {characters.length === 1
            ? 'personagem'
            : 'personagens'}
        </span>

      </div>

      {/* ERRO */}

      {error && (
        <div className="characters-error">

          <span>{error}</span>

          <button
            onClick={() =>
              setError('')
            }
          >
            <X size={16} />
          </button>

        </div>
      )}

      {/* LOADING */}

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

          {filteredCharacters.map(
            character => (
              <CharacterCard
                key={character.id}
                character={character}
                onEdit={openEdit}
                onDelete={handleDelete}
                onView={openView}
              />
            )
          )}

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

      {/* FORMULÁRIO */}

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
          onClose={() =>
            setModal(null)
          }
          onSubmit={handleSave}
          saving={saving}
        />

      )}

      {/* IA */}

      {modal === 'ai' && (
        <AIModal
          onClose={() =>
            setModal(null)
          }
          onGenerate={
            async prompt => {
              if (!user) return

              try {
                const token =
                  await user.getIdToken()

                const generated =
                  await generateCharacter(
                    prompt,
                    token
                  )

                setForm(
                  createFormFromGenerated(
                    generated
                  )
                )

                setModal('create')
              } catch (err) {
                console.error(err)

                setError(
                  'Não foi possível gerar o personagem.'
                )
              }
            }
          }
        />
      )}

      {/* FICHA */}

      {modal === 'view' &&
        selectedCharacter && (
          <CharacterSheet
            character={selectedCharacter}
            onClose={() => setModal(null)}
            onEdit={() =>
              openEdit(
                selectedCharacter
              )}
          />
        )}

    </div>
  )
}

/* Ajustar personagem da IA */

function createFormFromGenerated(
  generated: Partial<CreateCharacterData>
): CreateCharacterData {

  return {
    ...emptyCharacter,

    ...generated,

    atributos: {
      ...emptyCharacter.atributos,
      ...(generated.atributos || {}),
    },

    pericias: {
      ...emptyCharacter.pericias,
      ...(generated.pericias || {}),
    },

    saude: {
      ...emptyCharacter.saude,
      ...(generated.saude || {}),
    },

    defesas: {
      ...emptyCharacter.defesas,
      ...(generated.defesas || {}),
    },

    resistencias: {
      ...emptyCharacter.resistencias,
      ...(generated.resistencias || {}),
    },

    armas:
      generated.armas || [],

    habilidades:
      generated.habilidades || [],

    inventario:
      generated.inventario || [],
  }
}

/* Formulário */

interface CharacterFormModalProps {
  title: string
  form: CreateCharacterData
  setForm: Dispatch<SetStateAction<CreateCharacterData>>
  onClose: () => void
  onSubmit: (event: FormEvent) => void
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

  function updateField<K extends keyof CreateCharacterData>(
    field: K,
    value: CreateCharacterData[K]
  ) {
    setForm(current => ({
      ...current,
      [field]: value,
    }))
  }

  function updateAttribute(
    field: keyof CharacterAttributes,
    value: number
  ) {
    setForm(current => ({
      ...current,
      atributos: {
        ...current.atributos,
        [field]: value,
      },
    }))
  }

  function updateSkill(
    field: keyof CreateCharacterData['pericias'],
    value: number
  ) {
    setForm(current => ({
      ...current,
      pericias: {
        ...current.pericias,
        [field]: value,
      },
    }))
  }

  function updateHealth(
    field: keyof CreateCharacterData['saude'],
    value: number
  ) {
    setForm(current => ({
      ...current,
      saude: {
        ...current.saude,
        [field]: value,
      },
    }))
  }

  function updateDefense(
    field: keyof CreateCharacterData['defesas'],
    value: number
  ) {
    setForm(current => ({
      ...current,
      defesas: {
        ...current.defesas,
        [field]: value,
      },
    }))
  }

  function updateResistance(
    field: keyof CreateCharacterData['resistencias'],
    value: number
  ) {
    setForm(current => ({
      ...current,
      resistencias: {
        ...current.resistencias,
        [field]: value,
      },
    }))
  }

  /* Habilidades */

  function addAbility() {
    const ability: Ability = {
      id: crypto.randomUUID(),
      nome: '',
      tipo: '',
      descricao: '',
      custo: 0,
      requisito: '',
    }

    setForm(current => ({
      ...current,
      habilidades: [
        ...current.habilidades,
        ability,
      ],
    }))
  }

  function updateAbility(
    index: number,
    field: keyof Ability,
    value: string | number
  ) {
    setForm(current => {

      const habilidades = [
        ...current.habilidades,
      ]

      habilidades[index] = {
        ...habilidades[index],
        [field]: value,
      }

      return {
        ...current,
        habilidades,
      }
    })
  }

  function removeAbility(index: number) {
    setForm(current => ({
      ...current,
      habilidades: current.habilidades.filter(
        (_, i) => i !== index
      ),
    }))
  }

  /* Armas*/

  function addWeapon() {
    const weapon: Weapon = {
      id: crypto.randomUUID(),

      nome: '',
      tipo: '',

      ataque: 0,
      alcance: '',

      dano: '',
      critico: '',

      recarga: '',
      especial: '',
    }

    setForm(current => ({
      ...current,
      armas: [
        ...current.armas,
        weapon,
      ],
    }))
  }

  function updateWeapon(
    index: number,
    field: keyof Weapon,
    value: string | number
  ) {
    setForm(current => {

      const armas = [
        ...current.armas,
      ]

      armas[index] = {
        ...armas[index],
        [field]: value,
      }

      return {
        ...current,
        armas,
      }
    })
  }

  function removeWeapon(index: number) {
    setForm(current => ({
      ...current,
      armas: current.armas.filter(
        (_, i) => i !== index
      ),
    }))
  }

  /* Inventário*/

  function addInventoryItem() {
    const item: InventoryItem = {
      id: crypto.randomUUID(),

      nome: '',
      quantidade: 1,

      categoria: '',

      descricao: '',
    }

    setForm(current => ({
      ...current,
      inventario: [
        ...current.inventario,
        item,
      ],
    }))
  }

  function updateInventory(
    index: number,
    field: keyof InventoryItem,
    value: string | number
  ) {
    setForm(current => {

      const inventario = [
        ...current.inventario,
      ]

      inventario[index] = {
        ...inventario[index],
        [field]: value,
      }

      return {
        ...current,
        inventario,
      }
    })
  }

  function removeInventory(index: number) {
    setForm(current => ({
      ...current,
      inventario: current.inventario.filter(
        (_, i) => i !== index
      ),
    }))
  }

  return (
    <div className="modal-overlay">

      <div className="character-modal">

        {/* Header Modal */}

        <header className="modal-header">
          <div>
            <span className="page-label">
              FICHA DE ORDEM PARANORMAL
            </span>

            <h2>
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
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
                  value={form.nome}
                  required
                  onChange={event =>
                    updateField(
                      'nome',
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Jogador
                <input
                  value={form.jogador}
                  onChange={event =>
                    updateField(
                      'jogador',
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Origem
                <input
                  value={form.origem}
                  placeholder="Ex.: Acadêmico"
                  onChange={event =>
                    updateField(
                      'origem',
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                Classe
                <input
                  value={form.classe}
                  placeholder="Ex.: Especialista"
                  onChange={event =>
                    updateField(
                      'classe',
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                NEX (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.nex}
                  onChange={event =>
                    updateField(
                      'nex',
                      Number(event.target.value)
                    )
                  }
                />
              </label>

              <label>
                Patente
                <input
                  value={form.patente}
                  placeholder="Ex.: Recruta"
                  onChange={event =>
                    updateField(
                      'patente',
                      event.target.value
                    )
                  }
                />
              </label>

            </div>

          </section>
          <section>
            <h3>Atributos</h3>
            <div className="attribute-grid">
              {ATTRIBUTES.map(
                ({
                  field,
                  label,
                  short,
                }) => (

                  <label
                    key={field}
                    className="attribute-field"
                  >

                    <span>
                      {short}
                    </span>

                    <small>
                      {label}
                    </small>

                    <input
                      type="number"
                      min="0"
                      value={
                        form.atributos[field]
                      }
                      onChange={event =>
                        updateAttribute(
                          field,
                          Number(
                            event.target.value
                          )
                        )
                      }
                    />
                  </label>
                )
              )}
            </div>
          </section>

          <section>
          <h3>Perícias</h3>
          <div className="attribute-grid">
            {(
              Object.keys(
                form.pericias
              ) as Array<
                keyof CreateCharacterData['pericias']
              >
            ).map(field => (

              <label
                key={field}
                className="attribute-field"
              >

                <span>
                  {formatLabel(field)}
                </span>

                <input
                  type="number"
                  value={form.pericias[field]}
                  onChange={event =>
                    updateSkill(
                      field,
                      Number(event.target.value)
                    )
                  }
                />

              </label>

            ))}
          </div>
        </section>

          <section>
            <h3>
              Saúde e Recursos
            </h3>
            <div className="form-grid">
              <label>
                PV máximo

                <input
                  type="number"
                  min="0"
                  value={form.saude.pv}
                  onChange={event =>
                    updateHealth(
                      'pv',
                      Number(event.target.value)
                    )
                  }
                />
              </label>

              <label>
                PV atual

                <input
                  type="number"
                  min="0"
                  value={form.saude.pvAtual}
                  onChange={event =>
                    updateHealth(
                      'pvAtual',
                      Number(event.target.value)
                    )
                  }
                />
              </label>

              <label>
                SAN máxima

                <input
                  type="number"
                  min="0"
                  value={form.saude.san}
                  onChange={event =>
                    updateHealth(
                      'san',
                      Number(event.target.value)
                    )
                  }
                />
              </label>

              <label>
                SAN atual

                <input
                  type="number"
                  min="0"
                  value={form.saude.sanAtual}
                  onChange={event =>
                    updateHealth(
                      'sanAtual',
                      Number(event.target.value)
                    )
                  }
                />
              </label>

              <label>
                PE máximo
                <input
                  type="number"
                  min="0"
                  value={form.saude.pe}
                  onChange={event =>
                    updateHealth(
                      'pe',
                      Number(event.target.value)
                    )
                  }
                />
              </label>

              <label>
                PE atual
                <input
                  type="number"
                  min="0"
                  value={form.saude.peAtual}
                  onChange={event =>
                    updateHealth(
                      'peAtual',
                      Number(event.target.value)
                    )
                  }
                />
              </label>
            </div>
          </section>

          <section>
            <h3>Defesas</h3>
            <div className="form-grid">
              <label>
                Defesa Passiva
                <input
                  type="number"
                  value={form.defesas.passiva}
                  onChange={event =>
                    updateDefense(
                      'passiva',
                      Number(event.target.value)
                    )
                  }
                />
              </label>
              <label>
                Bloqueio
                <input
                  type="number"
                  value={form.defesas.bloqueio}
                  onChange={event =>
                    updateDefense(
                      'bloqueio',
                      Number(event.target.value)
                    )
                  }
                />
              </label>
              <label>
                Esquiva
                <input
                  type="number"
                  value={form.defesas.esquiva}
                  onChange={event =>
                    updateDefense(
                      'esquiva',
                      Number(event.target.value)
                    )
                  }
                />
              </label>
            </div>
          </section>

          <section>
            <h3>Resistências</h3>
            <div className="attribute-grid">
              {(
                Object.keys(
                  form.resistencias
                ) as Array<
                  keyof CreateCharacterData['resistencias']
                >
              ).map(field => (

                <label
                  key={field}
                  className="attribute-field"
                >

                  <span>
                    {formatLabel(field)}
                  </span>

                  <input
                    type="number"
                    value={
                      form.resistencias[field]
                    }
                    onChange={event =>
                      updateResistance(
                        field,
                        Number(
                          event.target.value
                        )
                      )
                    }
                  />

                </label>
              ))}
            </div>
          </section>

          <section>
            <div className="section-title-row">
              <h3>
                Habilidades
              </h3>
              <button
                type="button"
                className="secondary-button"
                onClick={addAbility}
              >
                <Plus size={15} />
                Adicionar
              </button>
            </div>

            <div className="dynamic-list">
              {form.habilidades.length === 0 ? (

                <p className="empty-list">
                  Nenhuma habilidade adicionada.
                </p>

              ) : (

                form.habilidades.map(
                  (ability, index) => (

                    <div
                      className="dynamic-card"
                      key={ability.id}
                    >

                      <div className="dynamic-card-header">

                        <strong>
                          Habilidade {index + 1}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            removeAbility(index)
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>


                      <div className="form-grid">

                        <label>
                          Nome

                          <input
                            value={ability.nome}
                            onChange={event =>
                              updateAbility(
                                index,
                                'nome',
                                event.target.value
                              )
                            }
                          />
                        </label>


                        <label>
                          Tipo

                          <input
                            value={ability.tipo}
                            placeholder="Ex.: Poder"
                            onChange={event =>
                              updateAbility(
                                index,
                                'tipo',
                                event.target.value
                              )
                            }
                          />
                        </label>


                        <label>
                          Custo

                          <input
                            type="number"
                            min="0"
                            value={
                              ability.custo ?? 0
                            }
                            onChange={event =>
                              updateAbility(
                                index,
                                'custo',
                                Number(
                                  event.target.value
                                )
                              )
                            }
                          />
                        </label>

                        <label>
                          Requisito

                          <input
                            value={
                              ability.requisito ?? ''
                            }
                            onChange={event =>
                              updateAbility(
                                index,
                                'requisito',
                                event.target.value
                              )
                            }
                          />
                        </label>

                      </div>


                      <label>
                        Descrição

                        <textarea
                          rows={4}
                          value={
                            ability.descricao
                          }
                          onChange={event =>
                            updateAbility(
                              index,
                              'descricao',
                              event.target.value
                            )
                          }
                        />

                      </label>

                    </div>

                  )
                )

              )}

            </div>

          </section>


          {/* =================================================
              ARMAS
          ================================================= */}

          <section>

            <div className="section-title-row">

              <h3>Armas</h3>

              <button
                type="button"
                className="secondary-button"
                onClick={addWeapon}
              >
                <Plus size={15} />
                Adicionar
              </button>

            </div>


            <div className="dynamic-list">

              {form.armas.map(
                (weapon, index) => (

                  <div
                    className="dynamic-card"
                    key={weapon.id}
                  >

                    <div className="dynamic-card-header">

                      <strong>
                        Arma {index + 1}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          removeWeapon(index)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>


                    <div className="form-grid">

                      <label>
                        Nome

                        <input
                          value={weapon.nome}
                          onChange={event =>
                            updateWeapon(
                              index,
                              'nome',
                              event.target.value
                            )
                          }
                        />
                      </label>


                      <label>
                        Tipo

                        <input
                          value={weapon.tipo}
                          placeholder="Ex.: Pistola"
                          onChange={event =>
                            updateWeapon(
                              index,
                              'tipo',
                              event.target.value
                            )
                          }
                        />
                      </label>


                      <label>
                        Ataque

                        <input
                          type="number"
                          value={weapon.ataque}
                          onChange={event =>
                            updateWeapon(
                              index,
                              'ataque',
                              Number(
                                event.target.value
                              )
                            )
                          }
                        />
                      </label>


                      <label>
                        Alcance

                        <input
                          value={weapon.alcance}
                          onChange={event =>
                            updateWeapon(
                              index,
                              'alcance',
                              event.target.value
                            )
                          }
                        />
                      </label>


                      <label>
                        Dano

                        <input
                          value={weapon.dano}
                          placeholder="Ex.: 1d8"
                          onChange={event =>
                            updateWeapon(
                              index,
                              'dano',
                              event.target.value
                            )
                          }
                        />
                      </label>


                      <label>
                        Crítico

                        <input
                          value={weapon.critico}
                          onChange={event =>
                            updateWeapon(
                              index,
                              'critico',
                              event.target.value
                            )
                          }
                        />
                      </label>


                      <label>
                        Recarga

                        <input
                          value={weapon.recarga}
                          onChange={event =>
                            updateWeapon(
                              index,
                              'recarga',
                              event.target.value
                            )
                          }
                        />
                      </label>

                    </div>


                    <label>
                      Especial

                      <textarea
                        rows={3}
                        value={weapon.especial}
                        onChange={event =>
                          updateWeapon(
                            index,
                            'especial',
                            event.target.value
                          )
                        }
                      />

                    </label>

                  </div>

                )
              )}

            </div>

          </section>


          {/* =================================================
              INVENTÁRIO
          ================================================= */}

          <section>

            <div className="section-title-row">

              <h3>Inventário</h3>

              <button
                type="button"
                className="secondary-button"
                onClick={addInventoryItem}
              >
                <Plus size={15} />
                Adicionar
              </button>

            </div>


            <div className="dynamic-list">

              {form.inventario.map(
                (item, index) => (

                  <div
                    className="dynamic-card"
                    key={item.id}
                  >

                    <div className="dynamic-card-header">

                      <strong>
                        Item {index + 1}
                      </strong>

                      <button
                        type="button"
                        onClick={() =>
                          removeInventory(index)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>


                    <div className="form-grid">

                      <label>
                        Nome

                        <input
                          value={item.nome}
                          onChange={event =>
                            updateInventory(
                              index,
                              'nome',
                              event.target.value
                            )
                          }
                        />
                      </label>


                      <label>
                        Quantidade

                        <input
                          type="number"
                          min="1"
                          value={item.quantidade}
                          onChange={event =>
                            updateInventory(
                              index,
                              'quantidade',
                              Number(
                                event.target.value
                              )
                            )
                          }
                        />
                      </label>


                      <label>
                        Categoria

                        <input
                          value={item.categoria}
                          placeholder="Ex.: Equipamento"
                          onChange={event =>
                            updateInventory(
                              index,
                              'categoria',
                              event.target.value
                            )
                          }
                        />
                      </label>

                    </div>


                    <label>
                      Descrição

                      <textarea
                        rows={3}
                        value={
                          item.descricao ?? ''
                        }
                        onChange={event =>
                          updateInventory(
                            index,
                            'descricao',
                            event.target.value
                          )
                        }
                      />

                    </label>

                  </div>

                )
              )}

            </div>

          </section>


          {/* =================================================
              HISTÓRIA
          ================================================= */}

          <section>

            <h3>
              História e descrição
            </h3>


            <label>
              Conceito

              <textarea
                rows={3}
                value={form.descricao}
                placeholder="Descreva brevemente o personagem..."
                onChange={event =>
                  updateField(
                    'descricao',
                    event.target.value
                  )
                }
              />

            </label>


            <label>
              História

              <textarea
                rows={6}
                value={form.historia}
                placeholder="Conte a história do personagem..."
                onChange={event =>
                  updateField(
                    'historia',
                    event.target.value
                  )
                }
              />

            </label>

          </section>


          {/* =================================================
              IMAGEM
          ================================================= */}

          <section>

            <h3>Imagem</h3>

            <label>

              URL da imagem

              <input
                value={
                  form.imagemUrl || ''
                }
                placeholder="https://..."
                onChange={event =>
                  updateField(
                    'imagemUrl',
                    event.target.value
                  )
                }
              />

            </label>

          </section>


          {/* =================================================
              FOOTER
          ================================================= */}

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

/* =====================================================
   FORMATAR LABEL
===================================================== */

function formatLabel(
  value: string
) {
  const labels: Record<string, string> = {
    fisica: 'Física',
    balistica: 'Balística',
    insanidade: 'Insanidade',
    sangue: 'Sangue',
    morte: 'Morte',
    energia: 'Energia',
    conhecimento: 'Conhecimento',
    atletismo: 'Atletismo',
    atualidades: 'Atualidades',
    ciencia: 'Ciência',
    diplomacia: 'Diplomacia',
    enganacao: 'Enganação',
    fortitude: 'Fortitude',
    furtividade: 'Furtividade',
    intimidacao: 'Intimidação',
    intuicao: 'Intuição',
    investigacao: 'Investigação',
    luta: 'Luta',
    medicina: 'Medicina',
    ocultismo: 'Ocultismo',
    percepcao: 'Percepção',
    pilotagem: 'Pilotagem',
    pontaria: 'Pontaria',
    prestidigitacao: 'Prestidigitação',
    profissao: 'Profissão',
    reflexos: 'Reflexos',
    religiao: 'Religião',
    sobrevivencia: 'Sobrevivência',
    tatica: 'Tática',
    tecnologia: 'Tecnologia',
    vontade: 'Vontade',
  }

  return (
    labels[value] ||
    value
      .replace(
        /([A-Z])/g,
        ' $1'
      )
      .replace(
        /^./,
        letter =>
          letter.toUpperCase()
      )
  )
}