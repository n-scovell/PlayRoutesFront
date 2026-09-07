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
            // try {
            //     data = JSON.parse(text)
            // } catch {
            //     throw new Error(`Stripe API returned invalid JSON (${res.status})`)
            // }
            try {
                data = JSON.parse(text)
            } catch {
                console.error('INVALID STRIPE RESPONSE:', {
                    url: `${import.meta.env.VITE_API_URL}/api/stripe`,
                    status: res.status,
                    contentType: res.headers.get('content-type'),
                    response: text
                })

                throw new Error(
                    `Stripe API returned invalid JSON (${res.status}): ${text}`
                )
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
        }
    }
    return strp
}