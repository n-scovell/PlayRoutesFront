import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/userAuth'

export function useFormations() {
  const auth = useAuthStore()
  const myForm = ref('ccssdsdsd')
  const error = ref<string | null>(null)

  const formations = ref([])
  const loading = ref(false)

  async function fetchFormations() {
      const auth = useAuthStore()
      if (!auth.userId || !auth.token) {
        console.log('NO LOGIN FOUND')
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
      } catch (err: any) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }
  
  return {
    myForm,
    formations,
    fetchFormations
  }
}