export interface UserProfile {
  uid: string
  name: string
  email: string
  bio: string
  avatar: string
  isMaster: boolean
  charactersCount: number
  partiesCreated: number
  partiesJoined: number
}

export interface Party {
  id: string
  name: string
  system: string
  role: 'Mestre' | 'Player'
  players: number
  maxPlayers: number
  nextSession: string
  image: string
}