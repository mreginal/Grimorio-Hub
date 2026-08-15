
export interface Character {
  id: string

  name: string
  race: string
  className: string

  level: number

  background: string
  alignment: string

  description: string
  backstory: string

  imageUrl?: string

  hp: number
  maxHp: number

  armorClass: number
  initiative: number

  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number

  abilities: string[]
  spells: string[]
  inventory: string[]

  createdAt?: string
  updatedAt?: string
}

export type CreateCharacterData = Omit<
  Character,
  'id' | 'createdAt' | 'updatedAt'
>