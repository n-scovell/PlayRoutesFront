import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usePlayStore } from './playStore'
import { useFormation } from './formStore'
import { useFavorites } from './favStore'
// import { useBadges } from './badgeStore'
import { usePlayers } from './playerStore'

export const useAuthStore = defineStore('auth', () => {
  type User = {
    id: string
    email: string
    name?: string
    teamPin?: string
    sport?: string
    team?: string
    plan?: 'COACH' | 'TEAM'
  }

  type PlayerSession = {
    team: string
    sport?: string
    token?: string
  }

  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  const player = ref<PlayerSession | null>(null)
  const pName = ref<string>('')
  const pPos = ref<string>('')

  const isAuthenticated = computed(() => !!token.value)

  const userId = computed(() => user.value?.id || null)
  const userName = computed(() => user.value?.name || null)
  const teamName = computed(() => user.value?.team || null)
  const sport = computed(() => user.value?.sport || null)
  
  async function createUser(
    email: string,
    password: string,
    name: string,
    teamPin: string,
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
      teamPin,
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
      action: 'login',
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
  const favStore = useFavorites()
  const playStore = usePlayStore()
  // const badgeStore = useBadges()
  const playerStore = usePlayers()
  await playStore.fetchPlays()
  await formStore.fetchFormations()
  await favStore.fetchFavorites()
  // await badgeStore.fetchBadges()
  await playerStore.fetchPlayers()
}


async function playerLogin(team: any, teamPin: any, playername: string, myPos: string) {
    const res = await fetch('https://play-route-back.vercel.app/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'player-login',
      team,
      teamPin,
    }),
  })
  const data = await res.json()
  pName.value = playername
  pPos.value = myPos
  if (!res.ok) {
    throw new Error(data.error || 'Login for player failed')
  }
  player.value = data.user
  const playStore = usePlayStore()
  await playStore.fetchTeamPlays(
    data.user.id,
    data.token
  )
}

function playerLogout() {
  const playStore = usePlayStore()
  playStore.clearPlays()
  pName.value = ''
  pPos.value = ''
  player.value = null
}
  function logout() {
    const playStore = usePlayStore()
    const formStore = useFormation()
    const favStore = useFavorites()
    playStore.clearPlays()
    formStore.clearFormations()
    favStore.clearFavorites()
    user.value = null
    player.value = null
    token.value = null
    localStorage.removeItem('token')

  }

  async function updateUser(updates: { 
      id?: string
      name?: string
      sport?: string
      teamPin?: string | number
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

  async function refreshUser() {
  if (!user.value || !token.value) return

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users?userId=${user.value.id}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      }
    )

    if (!res.ok) {
      throw new Error('Failed to refresh user')
    }

    const data = await res.json()

    user.value = data

    return data
  } catch (err) {
    console.error('Failed to refresh user:', err)
  }
}

  async function updatePassword(password: string) {
  if (!user.value) return

  const res = await fetch(
    'https://play-route-back.vercel.app/api/users',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'update-password',
        id: user.value.id,
        password,
      }),
    }
  )

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update password')
  }

  return data
}

  return {
    user,
    token,
    player,
    pName,
    pPos,
    isAuthenticated,
    userId,
    userName,
    teamName,
    sport,
    playerLogout,
    createUser,
    login,
    logout,
    updateUser,
    playerLogin,
    updatePassword,
    refreshUser
  }
}, {
  persist: true
})