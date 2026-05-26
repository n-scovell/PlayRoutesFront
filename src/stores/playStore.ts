import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './userAuth'

export const usePlayStore = defineStore(
  'plays',
  () => {

    const deleting = ref<boolean>(false)
    const plays = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchPlays() {
      console.log('FETCHING API')
      const auth = useAuthStore()
      if (!auth.userId || !auth.token) {
        return
      }
      try {
        loading.value = true
        error.value = null
        const res = await fetch(
          `https://play-route-back.vercel.app/api/play?userId=${auth.userId}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          }
        )
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch plays')
        }
        plays.value = data
      } catch (err: any) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
    async function createPlay(payload: any) {
      const auth = useAuthStore()
      if (!auth.token || !auth.userId) {
      throw new Error("Not authenticated")
      }
      loading.value = true
      const res = await fetch("https://play-route-back.vercel.app/api/play", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create play")
      }
      // 🔥 ensure backend returned real play
      if (!data?.id) {
        throw new Error("Invalid play response from server")
      }
      // 🔥 prevent duplicates (optional but useful)
      const exists = plays.value.some(p => p.id === data.id)
      if (!exists) {
        plays.value.unshift(data)
      }
      loading.value = false
      return data
  }

  async function deletePlay(id: string) {
    console.log('DELEETING API')
    plays.value = plays.value.filter(p => p.id !== id)
    deleting.value = true
    const res = await fetch(`https://play-route-back.vercel.app/api/play?id=${id}`, {
      method: "DELETE"
    })
    const text = await res.text()
    // console.log("DELETE RESPONSE:", text)
    if (!res.ok) throw new Error("Delete failed")
    deleting.value = false
  }


    function clearPlays() {
      plays.value = []
    }

    return {
      plays,
      loading,
      error,
      deleting,

      fetchPlays,
      createPlay,
      clearPlays,
      deletePlay
    }
  },
  {
    persist: true
  }
)