import { ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js'
import { useAuthStore } from '../stores/userAuth'


export function stripeInit() {
    const auth = useAuthStore()
    const strp = {

        planSelect: ref<'COACH' | 'TEAM' | ''>(''),
        paymentError: ref(''),
        registrationUserId: ref(''),
        isProcessing: ref(false),
        stripePromise: loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY),
        stripe: null as Stripe | null,
        elements: null as StripeElements | null,
        paymentElement: null as StripePaymentElement | null,

        stripePlan: async (plan: 'COACH' | 'TEAM', id: string) => {
            strp.planSelect.value = plan
            strp.registrationUserId.value = id
            try {
                await strp.stripeSetup()
                
            } catch (err: any) {
                strp.paymentError.value = err.message || 'Unable to initialize payment'
                throw err
            }
        },
        stripeSetup: async () => {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        action: 'create-subscription',
                        userId: strp.registrationUserId.value,
                        plan: strp.planSelect.value
                    })
                }
            )
            // const data = await res.json()
            const text = await res.text()
            console.log('STRIPE STATUS:', res.status)
            console.log('STRIPE RESPONSE:', text)
            let data
            try {
                data = JSON.parse(text)
            } catch {
                throw new Error(`Stripe API returned invalid JSON (${res.status})`)
            }
            if (!res.ok) {
                throw new Error( data.error || 'Failed to activate payment')
            }
            if (!data.clientSecret) {
                throw new Error( 'Stripe client secret was not returned' )
            }
            strp.stripe = await strp.stripePromise
            if (!strp.stripe) {
                throw new Error( 'Stripe failed to initialize' )
            }
            strp.elements  = strp.stripe.elements( { clientSecret: data.clientSecret } )
            strp.paymentElement = strp.elements.create('payment')
            strp.paymentElement.mount('#payment-element')
        },
        stripePayment: async () => {
            strp.paymentError.value = ''
            strp.isProcessing.value = true
            try {
                if (!strp.stripe || !strp.elements) {
                    throw new Error('Stripe has not been initialized')
                }
                const { error, paymentIntent } =
                await strp.stripe.confirmPayment({
                    elements: strp.elements,
                    confirmParams: { return_url: `${window.location.origin}/register` },
                    redirect: 'if_required'
                })
                if (error) {
                    strp.paymentError.value = error.message || 'Payment failed'
                    return
                }
            } catch (err: any) {
                console.error('PAYMENT ERROR:', err)
                strp.paymentError.value = err.message || 'Unable to process payment'
            } finally {
                strp.isProcessing.value = false
            }
        },
        manageSubscription: async () => {
            if (!auth.userId || !auth.token) {
                return
            }
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${auth.token}`
                    },
                    body: JSON.stringify({
                        action: 'manage-subscription'
                    })
                })
                const data = await res.json()
                if (!res.ok) {
                    throw new Error(data.error || 'Unable to open subscription management')
                }
                if (!data.url) {
                    throw new Error('Stripe portal URL was not returned')
                }
                window.location.href = data.url
            } catch (err: any) {
                console.error('SUBSCRIPTION MANAGEMENT ERROR:', err)
                strp.paymentError.value =
                    err.message || 'Unable to open subscription management'
            }
        },
    }
    return strp
}