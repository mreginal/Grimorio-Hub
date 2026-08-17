export interface CharacterAttributes {
  forca: number
  agilidade: number
  intelecto: number
  presenca: number
  vigor: number
}

export interface CharacterSkills {
  atletismo: number
  atualidades: number
  ciencia: number
  diplomacia: number
  enganacao: number
  fortitude: number
  furtividade: number
  intimidacao: number
  intuicao: number
  investigacao: number
  luta: number
  medicina: number
  ocultismo: number
  percepcao: number
  pilotagem: number
  pontaria: number
  prestidigitacao: number
  profissao: number
  reflexos: number
  religiao: number
  sobrevivencia: number
  tatica: number
  tecnologia: number
  vontade: number
}

export interface CharacterHealth {
  pv: number
  pvAtual: number

  san: number
  sanAtual: number

  pe: number
  peAtual: number
}

export interface CharacterDefenses {
  passiva: number
  bloqueio: number
  esquiva: number
}

export interface CharacterResistances {
  fisica: number
  balistica: number

  insanidade: number
  sangue: number
  morte: number
  energia: number
  conhecimento: number
}

export interface Weapon {
  id: string

  nome: string
  tipo: string

  ataque: number
  alcance: string

  dano: string
  critico: string

  recarga: string
  especial: string
}

export interface Ability {
  id: string

  nome: string
  tipo: string

  descricao: string

  custo?: number
  requisito?: string
}

export interface InventoryItem {
  id: string

  nome: string
  quantidade: number

  categoria: string

  descricao?: string
}

export interface Character {
  id: string
  userId: string

  nome: string
  jogador: string

  origem: string
  classe: string

  nex: number
  patente: string

  atributos: CharacterAttributes

  pericias: CharacterSkills

  saude: CharacterHealth

  defesas: CharacterDefenses

  resistencias: CharacterResistances

  armas: Weapon[]

  habilidades: Ability[]

  inventario: InventoryItem[]

  descricao: string
  historia: string

  imagemUrl: string

  createdAt?: string
  updatedAt?: string
}

export type CreateCharacterData = Omit<
  Character,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>

export interface ResourceProps {
  icon: React.ReactNode
  label: string
  current: number
  maximum: number
  color?: 'purple' | 'red' | 'blue' | 'yellow'
}