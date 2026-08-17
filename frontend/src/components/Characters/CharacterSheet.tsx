import { X, Crown, Shield, Heart, Brain, Zap } from 'lucide-react'
import type { Character, ResourceProps } from '../../types/character'
import { FaBrain, FaHeart } from 'react-icons/fa'
import { IoFlash } from 'react-icons/io5'

interface CharacterSheetProps {
  character: Character
  onClose: () => void
  onEdit: () => void
}

export function CharacterSheet({
  character,
  onClose,
  onEdit,
}: CharacterSheetProps) {
  return (
    <div className="modal-overlay">

      <div className="character-sheet">

        {/* HEADER */}
        <header className="modal-header">

          <div>
            <span className="page-label">
              FICHA DO PERSONAGEM
            </span>

            <h2>
              {character.nome}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
          >
            <X size={18} />
          </button>

        </header>


        <div className="sheet-content">

          {/* ============================================
              PERFIL
          ============================================ */}

          <div className="sheet-profile">

            <div
              className="sheet-avatar"
              style={{
                backgroundImage: character.imagemUrl
                  ? `url(${character.imagemUrl})`
                  : undefined,
              }}
            >
              {!character.imagemUrl && (
                <span>
                  {character.nome
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>


            <div className="sheet-profile-info">

              <span>
                {character.origem ||
                  'Origem não definida'}

                {' · '}

                {character.classe ||
                  'Classe não definida'}
              </span>

              <h1>
                {character.nome}
              </h1>

              <p>
                NEX {character.nex}%
                {' · '}
                {character.patente}
              </p>

              {character.jogador && (
                <small>
                  Jogador: {character.jogador}
                </small>
              )}

            </div>

          </div>


          {/* ============================================
              ATRIBUTOS
          ============================================ */}

          <section className="sheet-section">

            <div className="sheet-section-title">

              <h3>
                Atributos
              </h3>
            </div>


            <div className="sheet-attributes">

              <Attribute
                label="FOR"
                name="Força"
                value={
                  character.atributos.forca
                }
              />

              <Attribute
                label="AGI"
                name="Agilidade"
                value={
                  character.atributos.agilidade
                }
              />

              <Attribute
                label="INT"
                name="Intelecto"
                value={
                  character.atributos.intelecto
                }
              />

              <Attribute
                label="PRE"
                name="Presença"
                value={
                  character.atributos.presenca
                }
              />

              <Attribute
                label="VIG"
                name="Vigor"
                value={
                  character.atributos.vigor
                }
              />

            </div>

          </section>


          {/* ============================================
              SAÚDE
          ============================================ */}

          <section className="sheet-section">

            <div className="sheet-section-title">
              <h3>
                Saúde e Recursos
              </h3>

            </div>


            <div className="sheet-resource-grid">

              <Resource
                icon={<FaHeart size={20} />}
                label="PV"
                current={
                  character.saude.pvAtual
                }
                maximum={
                  character.saude.pv
                }
              />

              <Resource
                icon={<FaBrain size={20} />}
                label="SAN"
                current={
                  character.saude.sanAtual
                }
                maximum={
                  character.saude.san
                }
              />

              <Resource
                icon={<IoFlash size={20} />}
                label="PE"
                current={
                  character.saude.peAtual
                }
                maximum={
                  character.saude.pe
                }
              />

            </div>

          </section>


          {/* ============================================
              DEFESAS
          ============================================ */}

          <section className="sheet-section">

            <div className="sheet-section-title">

              <h3>
                Defesas
              </h3>

            </div>


            <div className="sheet-stat-grid">

              <Stat
                label="DEFESA PASSIVA"
                value={
                  character.defesas.passiva
                }
              />

              <Stat
                label="BLOQUEIO"
                value={
                  character.defesas.bloqueio
                }
              />

              <Stat
                label="ESQUIVA"
                value={
                  character.defesas.esquiva
                }
              />

            </div>

          </section>


          {/* ============================================
              RESISTÊNCIAS
          ============================================ */}

          <section className="sheet-section">

            <div className="sheet-section-title">

              <h3>
                Resistências
              </h3>

            </div>


            <div className="sheet-resistances">

              <Resistance
                label="Física"
                value={
                  character.resistencias.fisica
                }
              />

              <Resistance
                label="Balística"
                value={
                  character.resistencias.balistica
                }
              />

              <Resistance
                label="Insanidade"
                value={
                  character.resistencias.insanidade
                }
              />

              <Resistance
                label="Sangue"
                value={
                  character.resistencias.sangue
                }
              />

              <Resistance
                label="Morte"
                value={
                  character.resistencias.morte
                }
              />

              <Resistance
                label="Energia"
                value={
                  character.resistencias.energia
                }
              />

              <Resistance
                label="Conhecimento"
                value={
                  character.resistencias.conhecimento
                }
              />

            </div>

          </section>


          {/* ============================================
              CONTEÚDO
          ============================================ */}

          <div className="sheet-columns">

            {/* ESQUERDA */}

            <div>

              <section className="sheet-section">

                <h3>
                  História
                </h3>

                <p className="sheet-description">
                  {character.historia ||
                    'Nenhuma história registrada.'}
                </p>

              </section>


              <section className="sheet-section">

                <h3>
                  Descrição
                </h3>

                <p className="sheet-description">
                  {character.descricao ||
                    'Nenhuma descrição registrada.'}
                </p>

              </section>


              {/* HABILIDADES */}

              <section className="sheet-section">

                <h3>
                  Habilidades
                </h3>

                <AbilityList
                  abilities={
                    character.habilidades
                  }
                />

              </section>

            </div>


            {/* DIREITA */}

            <div>

              {/* PERÍCIAS */}

              <section className="sheet-section">

                <h3>
                  Perícias
                </h3>

                <div className="sheet-skills">
                  <SkillList
                    skills={
                      character.pericias
                    }
                  />
                </div>

              </section>


              {/* ARMAS */}

              <section className="sheet-section">

                <h3>
                  Armas
                </h3>

                <WeaponList
                  weapons={
                    character.armas
                  }
                />

              </section>


              {/* INVENTÁRIO */}

              <section className="sheet-section">

                <h3>
                  Inventário
                </h3>

                <InventoryList
                  items={
                    character.inventario
                  }
                />

              </section>

            </div>

          </div>

        </div>


        {/* FOOTER */}

        <footer className="modal-footer">

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Fechar
          </button>

          <button
            type="button"
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


/* =====================================================
   ATRIBUTO
===================================================== */

function Attribute({
  label,
  value,
}: {
  label: string
  name: string
  value: number
}) {
  return (
    <div className="sheet-attribute">

      <span className="sheet-attribute-label">
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  )
}


/* =====================================================
   RECURSO
===================================================== */

  function Resource({
    icon,
    label,
    current,
    maximum,
    color = 'purple',
  }: ResourceProps) {
    return (
      <div className={`sheet-resource resource-${color}`}>
        <div className="resource-info">
          <div className="resource-icon">
          {icon}
        </div>
          <span className="resource-label">
            {label}
          </span>

          <strong>
            {current} / {maximum}
          </strong>
        </div>
      </div>
    )
  }

/* =====================================================
   STAT
===================================================== */

function Stat({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="sheet-stat">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  )
}


/* =====================================================
   RESISTÊNCIA
===================================================== */

function Resistance({
  label,
  value,
}: {
  label: string
  value: number
}) {
  return (
    <div className="sheet-resistance">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  )
}


/* =====================================================
   PERÍCIAS
===================================================== */

  function SkillList({
    skills,
  }: {
    skills: Character['pericias']
  }) {
    const entries = Object.entries(skills)

    if (!entries.length) {
      return (
        <p className="empty-list">
          Nenhuma perícia registrada.
        </p>
      )
    }

    return (
      <div className="sheet-skill-list">
        {entries.map(([name, value]) => (
          <div
            className="sheet-skill"
            key={name}
          >
            <span>
              {formatSkillName(name)}
            </span>

            <strong>
              {value}
            </strong>
          </div>
        ))}
      </div>
    )
  }

/* =====================================================
   HABILIDADES
===================================================== */

function AbilityList({
  abilities,
}: {
  abilities: Character['habilidades']
}) {

  if (!abilities.length) {
    return (
      <p className="empty-list">
        Nenhuma habilidade registrada.
      </p>
    )
  }

  return (
    <div className="sheet-ability-list">

      {abilities.map(
        ability => (

          <div
            className="sheet-ability"
            key={ability.id}
          >

            <div>

              <strong>
                {ability.nome}
              </strong>

              {ability.tipo && (
                <span>
                  {ability.tipo}
                </span>
              )}

            </div>

            <p>
              {ability.descricao}
            </p>

            {ability.custo !== undefined && (
              <small>
                Custo: {ability.custo}
              </small>
            )}

          </div>

        )
      )}

    </div>
  )
}


/* =====================================================
   ARMAS
===================================================== */

function WeaponList({
  weapons,
}: {
  weapons: Character['armas']
}) {

  if (!weapons.length) {
    return (
      <p className="empty-list">
        Nenhuma arma registrada.
      </p>
    )
  }

  return (
    <div className="sheet-weapon-list">

      {weapons.map(
        weapon => (

          <div
            className="sheet-weapon"
            key={weapon.id}
          >

            <div className="sheet-weapon-header">

              <strong>
                {weapon.nome}
              </strong>

              <span>
                {weapon.tipo}
              </span>

            </div>

            <div className="sheet-weapon-stats">

              <span>
                Ataque:
                <strong>
                  {weapon.ataque}
                </strong>
              </span>

              <span>
                Alcance:
                <strong>
                  {weapon.alcance}
                </strong>
              </span>

              <span>
                Dano:
                <strong>
                  {weapon.dano}
                </strong>
              </span>

              <span>
                Crítico:
                <strong>
                  {weapon.critico}
                </strong>
              </span>

            </div>

            {weapon.especial && (
              <p>
                {weapon.especial}
              </p>
            )}

          </div>

        )
      )}

    </div>
  )
}


/* =====================================================
   INVENTÁRIO
===================================================== */

function InventoryList({
  items,
}: {
  items: Character['inventario']
}) {

  if (!items.length) {
    return (
      <p className="empty-list">
        Nenhum item no inventário.
      </p>
    )
  }

  return (
    <div className="sheet-inventory-list">

      {items.map(
        item => (

          <div
            className="sheet-inventory-item"
            key={item.id}
          >

            <div>

              <strong>
                {item.nome}
              </strong>

              {item.categoria && (
                <span>
                  {item.categoria}
                </span>
              )}

            </div>

            <strong>
              x{item.quantidade}
            </strong>

          </div>

        )
      )}

    </div>
  )
}


/* =====================================================
   FORMATAR NOMES
===================================================== */

function formatSkillName(
  value: string
) {

  const names: Record<string, string> = {

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
    names[value] ||
    value
  )
}