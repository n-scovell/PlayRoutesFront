import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './userAuth'

export const useFavorites = defineStore('favorites', () => {
    const deleting = ref<boolean>(false)
    const favorites = ref<any[]>([])
    const error = ref<string | null>(null)
    async function fetchFavorites() {
      const auth = useAuthStore()
      if (!auth.userId || !auth.token) {
        return
      }
      try {
        error.value = null
        const res = await fetch(`https://play-route-back.vercel.app/api/favorites?userId=${auth.userId}`, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          }
        )
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch favorites')
        }
        favorites.value = data
      } catch (err: any) {
        error.value = err.message
      } finally {
        // console.log('Favorites is loaded')
      }
    }
    async function createFavorite(playId: string) {
      const auth = useAuthStore()
      if (!auth.token || !auth.userId) {
      throw new Error("Not authenticated")
      }
      const res = await fetch("https://play-route-back.vercel.app/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          userId: auth.userId,
          playId: playId
        })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create favorite")
      }
      if (!data?.id) {
        throw new Error("Invalid response from server")
      }
      favorites.value.push(data)
      await fetchFavorites()
      return data
    }

    function clearFavorites() {
      favorites.value = []
    }

    async function deleteFavorite(id: string) {
      const auth = useAuthStore()
      const res = await fetch(`https://play-route-back.vercel.app/api/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          userId: auth.userId,
          playId: id
        })
      })
    }
    return {
      favorites,
      error,
      deleting,
      fetchFavorites,
      createFavorite,
      clearFavorites,
      deleteFavorite
    }
  },

  
  {
    persist: true
  }
)