export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  canBeMaster: boolean
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