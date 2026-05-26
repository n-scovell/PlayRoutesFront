import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/userAuth'

export function usePlays() {
  const auth = useAuthStore()
  const loading = ref(false)
  const plays = ref<any[]>([])
  const error = ref<string | null>(null)
  async function getPlays() {
    if (!auth.user?.id || !auth.token) {
      console.warn('User not authenticated')
      return
    }
    try {
      loading.value = true
      error.value = null
      const res = await fetch(
        `https://play-route-back.vercel.app/api/play?userId=${auth.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      )
      // console.log('STATUS:', res.status)
      const text = await res.text()
      // console.log('RAW RESPONSE:', text)
      if (!res.ok) {
        throw new Error(`Failed to fetch plays: ${res.status}`)
      }

      const data = JSON.parse(text)
      plays.value = data.map((play: any) => {
        let parsedGrid = null
        try {
          parsedGrid =
            typeof play.grid === 'string'
              ? JSON.parse(play.grid)
              : play.grid
        } catch {
          console.error('Invalid grid JSON:', play.id)
        }
        return {
          ...play,
          grid: parsedGrid
        }
      })
      console.log('PLAYS:', plays.value)
    } catch (err: any) {
      console.error(err)
      error.value = err.message || 'Something went wrong'
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getPlays()
  })

  return {
    plays,
    loading,
    error,
    getPlays
  }
}