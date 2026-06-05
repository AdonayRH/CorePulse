import { supabase } from './supabase'

export const PLANS = [
  {
    id: 'monthly',
    name: 'Plan Mensual',
    price: '125€',
    period: '/ mes',
    equivalent: null,
    savings: null,
    highlight: false,
    priceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY,
  },
  {
    id: '3months',
    name: 'Plan 3 Meses',
    price: '300€',
    period: '/ 3 meses',
    equivalent: '100€/mes',
    savings: 'Ahorra 20%',
    highlight: true,
    priceId: import.meta.env.VITE_STRIPE_PRICE_3MONTHS,
  },
  {
    id: '6months',
    name: 'Plan 6 Meses',
    price: '525€',
    period: '/ 6 meses',
    equivalent: '87,50€/mes',
    savings: 'Ahorra 30%',
    highlight: false,
    priceId: import.meta.env.VITE_STRIPE_PRICE_6MONTHS,
  },
]

export async function redirectToCheckout(priceId, userId, userEmail) {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { priceId, userId, userEmail },
  })

  if (error) throw new Error(error.message)
  if (!data?.url) throw new Error('No se recibió URL de checkout')

  window.location.href = data.url
}
