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
    const guestPlays = ref<any[]>([])
    const guestFormations = ref<any[]>([])

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

    async function createGuestPlay(payload: any) {
      const res = await fetch("https://play-route-back.vercel.app/api/guestplay",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload)
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw new Error(
          data.error || "Failed to create play for guest"
        )
      }
      return data
    }


    
    async function createGuestFormation(payload: any) {
      const res = await fetch("https://play-route-back.vercel.app/api/guestformation",
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload)
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw new Error(
          data.error || "Failed to create formation for guest"
        )
      }
      return data
    }




    async function emptyGuest() {
      guest.value = null
    }
    async function getGuestPlays(guestId: string) {
      if (!guestId) return
      try {
        const res = await fetch(
          `https://play-route-back.vercel.app/api/guestplay?guestId=${guestId}`
        )
        const data = await res.json()
        if (!res.ok) {
          throw new Error(
            data.error || 'Failed to fetch guest plays'
          )
        }
        guestPlays.value = data
        return data
      } catch (err: any) {
        console.error(err)
      }
    }
     async function getGuestFormations(id: string) {
      try {
        const res = await fetch(
          `https://play-route-back.vercel.app/api/guestformation?guestId=${id}`,
          {
            headers: {
              Authorization: `Bearer ${id}`
            }
          }
        )
        guestFormations.value = await res.json()
        if (!res.ok) {
          throw new Error('Failed to fetch plays')
        }
      } catch (err: any) {
        console.log(err)
      }
    }
    return {
      guest,
      guestPlays,
      guestFormations,
      createGuest,
      emptyGuest,
      createGuestPlay,
      getGuestPlays,
      createGuestFormation,
      getGuestFormations
    }
  },
  {
    persist: true
})