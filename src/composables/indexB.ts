// import { ref } from 'vue'
// interface User {
//   id: number
//   name?: string
//   email?: string
// }
// export function useUsers() {
//   const users = ref<User[]>([])
//   const loading = ref<boolean>(true)
//   const error = ref<string | null>(null)
//   const fetchUsers = async () => {
//     try {
//       loading.value = true
//       error.value = null
//       const response = await fetch('/api/users')
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
//       users.value = await response.json()
//     } catch (err: any) {
//       error.value = err.message || 'Failed to fetch users'
//       console.error('Failed to fetch users:', err)
//     } finally {
//       loading.value = false
//     }
//   }
//   return {users,loading,error,fetchUsers}
// }