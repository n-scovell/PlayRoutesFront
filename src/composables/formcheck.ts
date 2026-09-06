import { ref, watch } from 'vue'
// import { useAuthStore } from '../stores/userAuth'


export function formCheck() {
    // const auth = useAuthStore()
    const formcheck = {
         hasCap: ref(),
         hasLow: ref(),
         hasSpec: ref(),
         hasNumb: ref(),
         hasLen: ref(),
         
         ec: {
            300 : 'Please enter and confirm your password',
            301 : 'Passwords do not match',
            302 : 'Form not acceptable.',
            303 : 'Needs a capital letter',
            304 : 'Needs at lowercase letter',
            305 : 'Needs a special character - !@#$*',
            306 : 'Needs one number',
            307 : 'Needs to be more than ten characters'
         },

         // PASSWORD CLEAR
         checkPassword: async (firstPassword: string, secondPassword: string) => {
            if (!firstPassword || !secondPassword) throw new Error(formcheck.ec[300])
            if (!/[A-Z]/.test(firstPassword)) throw new Error(formcheck.ec[303])
            if (!/[a-z]/.test(firstPassword)) throw new Error(formcheck.ec[304])
            if (!/[^a-zA-Z0-9]/.test(firstPassword)) throw new Error(formcheck.ec[305]) 
            if (!/[0-9]/.test(firstPassword)) throw new Error(formcheck.ec[306]) 
            if (firstPassword.length < 10) throw new Error(formcheck.ec[307])
            if (firstPassword !== secondPassword) throw new Error(formcheck.ec[301])
            return true
         },

         // PIN NUMBER CLEAR
         checkPin: async (a: string, name: string, team: string) => {
            if (!a) {
               throw new Error('You need a pin number')
            }
            if (name.includes(a) || team.includes(a)) {
               throw new Error(`You cannot use anything that resembles your name or team`)
            }
            if (a === '12345') {
               throw new Error(`That's the kind of thing an idiot has on his luggage!`)
            }
            if (a === '123456') {
               throw new Error(`Adding six is pathetic.`)
            }
            if (a === '1234567') {
               throw new Error(`Do... do you not understand what a pin is?`)
            }
            if (a === '12345678') {
               throw new Error(`Oh come on!`)
            }
            if (a === '123456789') {
               throw new Error(`This is getting ridiculous.`)
            }
            if (a === '12345678910') {
               throw new Error(`Now you're just playing with me.`)
            }
            if (a.length <= 4) {
               throw new Error('Pin Number Needs At Least 5 Numbers')
            }
            return true
         },

         // VERIFY EMAIL
         checkEmail: async (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
               throw new Error('Email is not valid')
            }
            return true
         },

         //CHECKS INPUT VALUE
         checkInput: async (a: string, obj: string) => {
            if (!a) {
               if (obj === 'sport') {
                  throw new Error('Select a sport')
               } else {
                  throw new Error(`Enter a ${obj}`)
               }
            }
         },
         
         // CHECKS WHILE PASSWORD IS BEING TYPED
         verifyPass: (pass: string) => {
            formcheck.hasCap.value = !/[A-Z]/.test(pass) ? false : true
            formcheck.hasLow.value = !/[a-z]/.test(pass) ? false : true
            formcheck.hasSpec.value = !/[^a-zA-Z0-9]/.test(pass) ? false : true
            formcheck.hasNumb.value = !/[0-9]/.test(pass) ? false : true
            formcheck.hasLen.value = pass.length < 10 ? false : true
            return (
               formcheck.hasCap.value &&
               formcheck.hasLow.value &&
               formcheck.hasSpec.value &&
               formcheck.hasNumb.value &&
               formcheck.hasLen.value
            )
         },
    }
    return formcheck
}