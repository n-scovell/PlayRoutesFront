import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useGuest = defineStore('guest', () => {

    interface Guest {
      id: string
      name: string
      email: string
      description?: string
    }
    const guest = ref<Guest | null>(null)

    //FUNCTIONS
    async function createGuest( name: string, email: string, description: string ) {
      const res = await fetch('https://play-route-back.vercel.app/api/guest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, description }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to create guest')
      }
      const data = await res.json()
      guest.value = data
      return data
    }
    return {
      guest,
      createGuest
    }
  },
  {
    persist: false
})