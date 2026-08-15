import type {
  Character,
  CreateCharacterData,
} from '../types/character'

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request<T>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,

    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição')
  }

  return data
}

export async function getCharacters(
  token: string
): Promise<Character[]> {
  const data = await request<{ characters: Character[] }>(
    '/characters',
    token
  )

  return data.characters
}

export async function getCharacter(
  id: string,
  token: string
): Promise<Character> {
  const data = await request<{ character: Character }>(
    `/characters/${id}`,
    token
  )

  return data.character
}

export async function createCharacter(
  character: CreateCharacterData,
  token: string
): Promise<Character> {
  const data = await request<{ character: Character }>(
    '/characters',
    token,
    {
      method: 'POST',
      body: JSON.stringify(character),
    }
  )

  return data.character
}

export async function updateCharacter(
  id: string,
  character: Partial<CreateCharacterData>,
  token: string
): Promise<Character> {
  const data = await request<{ character: Character }>(
    `/characters/${id}`,
    token,
    {
      method: 'PUT',
      body: JSON.stringify(character),
    }
  )

  return data.character
}

export async function deleteCharacter(
  id: string,
  token: string
): Promise<void> {
  await request(
    `/characters/${id}`,
    token,
    {
      method: 'DELETE',
    }
  )
}

export async function generateCharacter(
  prompt: string,
  token: string
): Promise<Partial<Character>> {
  const data = await request<{ character: Partial<Character> }>(
    '/characters/generate',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }
  )

  return data.character
}