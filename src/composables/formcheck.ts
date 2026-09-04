import { ref } from 'vue'
// import { useAuthStore } from '../stores/userAuth'


export function formCheck() {
    // const auth = useAuthStore()
    const formcheck = {
         hasCap: ref(false),
         hasLow: ref(false),
         hasSpec: ref(false),
         hasNumb: ref(false),
         hasLen: ref(false),
         allClear: ref(false),

         ec: {
            300 : 'Please enter and confirm your password',
            301 : 'Passwords do not match'
         },

         checkPassword: async (firstPassword: string, secondPassword: string) => {
            if (!firstPassword || !secondPassword) throw new Error(formcheck.ec[300])
            if (!firstPassword != !secondPassword) throw new Error(formcheck.ec[301])
            
         }
    }
    return formcheck
}


// const checkPassword = async (a: string, b: string) => {
//   if (!a || !b) {
//     throw new Error('Please enter and confirm your password')
//   }
//   if (a !== b) {
//     throw new Error('Passwords do not match')
//   }
//   if (!allClear) {
//     throw new Error('Password Needs Work')
//   }
//   return true
// }