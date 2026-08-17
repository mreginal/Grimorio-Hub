import type {
  Character,
  CreateCharacterData,
} from '../types/character'

const API_URL = 'http://localhost:5000/api'

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,

      headers: {
        'Content-Type': 'application/json',

        ...(options.headers || {}),
      },
    }
  )

  const data = await response.json()

  if (!response.ok) {

    throw new Error(
      data.message ||
      data.error ||
      'Erro na requisição.'
    )
  }

  return data
}


/* =====================================================
   GET
===================================================== */

export async function getCharacters(
  token: string
): Promise<Character[]> {

  return request<Character[]>(
    '/characters',
    {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}


/* =====================================================
   CREATE
===================================================== */

export async function createCharacter(
  character: CreateCharacterData,
  token: string
): Promise<Character> {

  console.log(
    'POST /characters',
    character
  )

  return request<Character>(
    '/characters',
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(character),
    }
  )
}


/* =====================================================
   UPDATE
===================================================== */

export async function updateCharacter(
  id: string,
  character: CreateCharacterData,
  token: string
): Promise<Character> {

  return request<Character>(
    `/characters/${id}`,
    {
      method: 'PUT',

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(character),
    }
  )
}


/* =====================================================
   DELETE
===================================================== */

export async function deleteCharacter(
  id: string,
  token: string
): Promise<void> {

  await request(
    `/characters/${id}`,
    {
      method: 'DELETE',

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
}


/* =====================================================
   IA
===================================================== */

export async function generateCharacter(
  prompt: string,
  token: string
): Promise<Partial<CreateCharacterData>> {

  return request<Partial<CreateCharacterData>>(
    '/characters/generate',
    {
      method: 'POST',

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        prompt,
      }),
    }
  )
}