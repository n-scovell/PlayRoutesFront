import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './userAuth'

export const useFormation = defineStore(
  'formations',
  () => {
    const formations = ref<any[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)
    const addedForm = ref(false)

    async function fetchFormations() {
      const auth = useAuthStore()
      if (!auth.userId || !auth.token) {
        return
      }
      try {
        // loading.value = true
        error.value = null
        const res = await fetch(
          `https://play-route-back.vercel.app/api/formation?userId=${auth.userId}`,
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
        formations.value = data
        addedForm.value = true
        console.log('YOU HAVE :' + formations.value.length + ' formations')
      } catch (err: any) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
  async function createFormation(payload: any) {      
      const auth = useAuthStore()
      if (!auth.token || !auth.userId) {
        throw new Error("Not authenticated")
      }
      const res = await fetch("https://play-route-back.vercel.app/api/formation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Failed to create formation")
      }
      if (!data?.id) {
        throw new Error("Invalid formation response from server")
      }
      const exists = formations.value.some(p => p.id === data.id)
      if (!exists) {
        formations.value.unshift(data)
      }
      return data
  }

  async function deletePlay(id: string) {
    formations.value = formations.value.filter(p => p.id !== id)
    const res = await fetch(`https://play-route-back.vercel.app/api/play?id=${id}`, {
      method: "DELETE"
    })
    const text = await res.text()
    // console.log("DELETE RESPONSE:", text)
    if (!res.ok) throw new Error("Delete failed")
  }


    function clearFormations() {
      formations.value = []
    }

    return {
      formations,
      addedForm,
      fetchFormations,
      createFormation,
      clearFormations
    }
  }, 
  {
    persist: true
  }
)