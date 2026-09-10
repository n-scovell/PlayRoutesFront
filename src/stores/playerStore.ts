import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './userAuth'

export const usePlayers = defineStore('players', () => {
    const deleting = ref<boolean>(false)
    const players = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const playerNumberExists = ref<boolean>(false)
    async function fetchPlayers() {
      const auth = useAuthStore()
      if (!auth.userId || !auth.token) {
        return
      }
      try {
        loading.value = true
        error.value = null
        const res = await fetch(
          `https://play-route-back.vercel.app/api/player?userId=${auth.userId}`,
          {
            headers: { Authorization: `Bearer ${auth.token}`}
          }
        )
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch players')
        }
        players.value = data
      } catch (err: any) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    async function deletePlayer(id: string) {
      players.value = players.value.filter(p => p.id !== id)
      const res = await fetch(`https://play-route-back.vercel.app/api/player`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id
        })
      })
      if (!res.ok) {
        throw new Error("Delete failed")
      }
      fetchPlayers()
    }

    async function addPlayer(payload: any) {
      const auth = useAuthStore()
      playerNumberExists.value = false
      loading.value = true
      if (!auth.token || !auth.userId) {
        throw new Error("Not authenticated")
      }

      const playerNum = players.value.some(p => Number(p.playerNumber) === Number(payload.playerNumber))
      // const nameExists = players.value.some(p => p.firstName.toLowerCase() === payload.firstName.toLowerCase() && p.lastName.toLowerCase() === payload.lastName.toLowerCase())
      if (playerNum) {
        playerNumberExists.value = true
        error.value = 'Number Already Assigned'
        return
      }
      playerNumberExists.value = false
      const res = await fetch("https://play-route-back.vercel.app/api/player", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create player")
      }
      loading.value = false
      fetchPlayers()
      return data
    }
    return {
      players,
      loading,
      error,
      deleting,
      playerNumberExists,
      fetchPlayers,
      deletePlayer,
      addPlayer
    }
  },
  {
    persist: true
  }
)