import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usePlayStore } from './playStore'
import { useFormation } from './formStore'

export const useAuthStore = defineStore('auth', () => {
  type User = {
    id: string
    email: string
    name?: string
    sport?: string
    team?: string
  }

  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)

  const userId = computed(() => user.value?.id || null)
  const userName = computed(() => user.value?.name || null)
  const teamName = computed(() => user.value?.team || null)

  async function createUser(
  email: string,
  password: string,
  name: string,
  sport: string,
  team: string
) {
  const res = await fetch('https://play-route-back.vercel.app/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      name,
      sport,
      team,
    }),
  })
  // Handle bad responses
  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(errorData.message || 'Failed to create user')
  }
  // Parse returned data
  const data = await res.json()
  return data
}

  async function login(email: any, password: any) {
    
  const res = await fetch('https://play-route-back.vercel.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email,
    password,
  }),
})
  

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Login failed')
  }

  user.value = data.user
  token.value = data.token

  // 🔥 hydrate plays/formations after login
  const formStore = useFormation()
  const playStore = usePlayStore()
  await playStore.fetchPlays()
  await formStore.fetchFormations()
}

  function logout() {
    const playStore = usePlayStore()
    const formStore = useFormation()
    playStore.clearPlays()
    formStore.clearFormations()
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function updateUser(updates: {
  id?: string
  name?: string
  sport?: string
  team?: string
  password?: string
}) {
  if (!user.value) return

  const res = await fetch(
    'https://play-route-back.vercel.app/api/users',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user.value.id,
        ...updates,
      }),
    }
  )

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'Failed to update user')
  }

  user.value = {
    ...user.value,
    ...data,
  }

  return data
}

 

  return {
    user,
    token,

    isAuthenticated,

    userId,
    userName,
    teamName,

    createUser,
    login,
    logout,
    updateUser
  }
}, {
  persist: true
})