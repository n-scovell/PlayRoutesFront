import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './userAuth'

export const usePlayers = defineStore('players', () => {
    const deleting = ref<boolean>(false)
    const players = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
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
    // async function assignBadge(badgeId: string) {
    //   const auth = useAuthStore()
    //   if (!auth.token || !auth.userId) {
    //   throw new Error("Not authenticated")
    //   }
    //   loading.value = true
    //   const res = await fetch("https://play-route-back.vercel.app/api/userbadge", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${auth.token}`
    //     },
    //     body: JSON.stringify({
    //       userId: auth.userId,
    //       badgeId
    //     })
    //   })
    //   const data = await res.json()
    //   if (!res.ok) {
    //     throw new Error(data.error || "Failed to assign badge")
    //   }
    //   return data
    // }
    // async function checkFormationBadges() {
    //   const forms = useFormation()
    //   await forms.fetchFormations()
    //   if (forms.formations.length >= 1) {
    //     await assignBadge("cmshye3c10003k304elikay36")
    //   }
    //   if (forms.formations.length >= 10) {
    //     await assignBadge("cmshyeehn0004k304x3daqai3")
    //   }
    //   if (forms.formations.length >= 20) {
    //     await assignBadge("cmshyemfy0005k3048k34h7dd")
    //   }
    // }
    return {
      players,
      loading,
      error,
      deleting,
      fetchPlayers,
      deletePlayer
    }
  },
  {
    persist: true
  }
)