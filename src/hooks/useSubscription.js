import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const EXEMPT_ROLES = ['admin', 'trainer']

export function useSubscription() {
  const { user, profile } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    if (EXEMPT_ROLES.includes(profile?.role)) {
      setSubscription({ status: 'active' })
      setLoading(false)
      return
    }
    fetchSubscription()
  }, [user, profile?.role])

  async function fetchSubscription() {
    const { data } = await supabase
      .from('subscriptions')
      .select('*, plan:plans(name, interval)')
      .eq('user_id', user.id)
      .in('status', ['active', 'past_due'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    setSubscription(data)
    setLoading(false)
  }

  const hasAccess = EXEMPT_ROLES.includes(profile?.role) || subscription?.status === 'active'

  return { subscription, loading, hasAccess }
}
