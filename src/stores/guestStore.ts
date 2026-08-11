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
    async function createGuestPlay(payload: any) {
      const res = await fetch("https://play-route-back.vercel.app/api/guestplay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
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


async function emptyGuest() {
  guest.value = null
}

const guestPlays = ref<any[]>([])
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
    console.log(guestPlays.value)
    return data
  } catch (err: any) {
    console.error(err)
  }
}
    

    return {
      guest,
      guestPlays,
      createGuest,
      createGuestPlay,
      getGuestPlays,
      emptyGuest
    }
  },
  {
    persist: true
})