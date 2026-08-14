const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function getHealth() {
  const response = await fetch(`${API_URL}/health`)
  if (!response.ok) throw new Error('API indisponível')
  return response.json()
}

export async function syncProfile(idToken: string, data: { displayName?: string }) {
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Não foi possível sincronizar o perfil')
  return response.json()
}