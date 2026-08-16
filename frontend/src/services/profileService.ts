import type { User as FirebaseUser } from 'firebase/auth'

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'


async function request(
  user: FirebaseUser,
  endpoint: string,
  options: RequestInit = {}
) {
  const token = await user.getIdToken()

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        'Content-Type': 'application/json',

        ...(options.headers || {}),

        Authorization: `Bearer ${token}`,
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error ||
      'Erro na requisição.'
    )
  }

  return data
}


export async function getProfile(
  user: FirebaseUser
) {
  const data = await request(
    user,
    '/profile'
  )

  return data.profile
}


export async function updateProfile(
  user: FirebaseUser,
  profile: {
    name: string
    bio: string
    avatar?: string
  }
) {
  const data = await request(
    user,
    '/profile',
    {
      method: 'PUT',

      body: JSON.stringify(profile),
    }
  )

  return data.profile
}


export async function updateMasterStatus(
  user: FirebaseUser,
  isMaster: boolean
) {
  const data = await request(
    user,
    '/profile/master',
    {
      method: 'PUT',

      body: JSON.stringify({
        isMaster,
      }),
    }
  )

  return data.profile
}