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

         inpEmail: ref(false),
         inpPassword: ref(false),
         inpPasswordRepeat: ref(false),
         inpTeam: ref(false),
         inpName: ref(false),
         inpSport: ref(false),
         inpPin: ref(false),
         inpVerify: ref(false),

         resetErrors: () => {
            formcheck.inpEmail.value = false
            formcheck.inpPassword.value = false
            formcheck.inpPasswordRepeat.value = false
            formcheck.inpTeam.value = false
            formcheck.inpName.value = false
            formcheck.inpSport.value = false
            formcheck.inpPin.value = false
            formcheck.inpVerify.value = false
         },
         
         ec: {
            300 : 'You need a good password',
            301 : 'Passwords do not match',
            302 : 'Form not acceptable.',
            303 : 'Needs a capital letter',
            304 : 'Needs at lowercase letter',
            305 : 'Needs a special character - !@#$*',
            306 : 'Needs one number',
            307 : 'Needs to be more than ten characters',
            308 : 'Double check passwords'
         },

         

         // PASSWORD CLEAR
         checkPassword: async (firstPassword: string, secondPassword: string) => {
            formcheck.resetErrors()
            if (!firstPassword) {
               formcheck.inpPassword.value = true
               throw new Error(formcheck.ec[300])
            }
            if (!/[A-Z]/.test(firstPassword)) {
               formcheck.inpPassword.value = true
               throw new Error(formcheck.ec[303])
            }
            if (!/[a-z]/.test(firstPassword)) {
               formcheck.inpPassword.value = true
               throw new Error(formcheck.ec[304])
            }
            if (!/[^a-zA-Z0-9]/.test(firstPassword)) {
               formcheck.inpPassword.value = true
               throw new Error(formcheck.ec[305]) 
            }
            if (!/[0-9]/.test(firstPassword)) {
               formcheck.inpPassword.value = true
               throw new Error(formcheck.ec[306]) 
            }
            if (firstPassword.length < 10) {
               formcheck.inpPassword.value = true
               throw new Error(formcheck.ec[307])
            }
            if (!secondPassword) {
               formcheck.inpPasswordRepeat.value = true
               throw new Error(formcheck.ec[308])
            }
            if (firstPassword !== secondPassword) { 
               formcheck.inpPasswordRepeat.value = true
               throw new Error(formcheck.ec[301])
            }
            return true
         },

         // PIN NUMBER CLEAR
         checkPin: async (a: string, name: string, team: string) => {
            formcheck.resetErrors()
            if (!a) {
               formcheck.inpPin.value = true;
               throw new Error('You need a pin number')
            }
            if (name.includes(a) || team.includes(a)) {
               formcheck.inpPin.value = true;
               throw new Error(`You cannot use anything that resembles your name or team`)
            }
            if (a === '12345') {
               formcheck.inpPin.value = true;
               throw new Error(`That's the kind of thing an idiot has on his luggage!`)
            }
            if (a === '123456') {
               formcheck.inpPin.value = true;
               throw new Error(`Adding six is pathetic.`)
            }
            if (a === '1234567') {
               formcheck.inpPin.value = true;
               throw new Error(`Do... do you not understand what a pin is?`)
            }
            if (a === '12345678') {
               formcheck.inpPin.value = true;
               throw new Error(`Oh come on!`)
            }
            if (a === '123456789') {
               formcheck.inpPin.value = true;
               throw new Error(`This is getting ridiculous.`)
            }
            if (a === '12345678910') {
               formcheck.inpPin.value = true;
               throw new Error(`Now you're just playing with me.`)
            }
            if (a.length <= 4) {
               formcheck.inpPin.value = true;
               throw new Error('Pin Number Needs At Least 5 Numbers')
            }
            return true
         },

         // VERIFY EMAIL
         checkEmail: async (email: string) => {
            formcheck.resetErrors()
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
               formcheck.inpEmail.value = true
               throw new Error('Email is not valid')
            }
            return true
         },

         //CHECKS INPUT VALUE
         checkInput: async (a: string, obj: string) => {
            formcheck.resetErrors()
            if (!a) {
               if (obj === 'sport') {
                  formcheck.inpSport.value = true
                  throw new Error('Select a sport')
               } else if (obj === 'team') {
                  formcheck.inpTeam.value = true
                  throw new Error('You need a team name')
               } else if ( obj === 'name' ) {
                  formcheck.inpName.value = true
                  throw new Error('You need a name')
               } else if ( obj === 'code' ) {
                  formcheck.inpVerify.value = true
                  throw new Error('You need a verification code')
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