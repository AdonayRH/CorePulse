import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'

export function ProtectedRoute({ children, allowedRoles, requireSubscription = true }) {
    const { user, profile, loading: authLoading } = useAuth()
    const { hasAccess, loading: subLoading } = useSubscription()

    if (authLoading || subLoading) return <div>Cargando...</div>

    if (!user) return <Navigate to="/login" replace />

    if (allowedRoles && !allowedRoles.includes(profile?.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    // Admin y Trainer siempre tienen acceso sin suscripción
    const exemptRoles = ['admin', 'trainer']
    if (requireSubscription && !exemptRoles.includes(profile?.role) && !hasAccess) {
        return <Navigate to="/pricing" replace />
    }

    return children
}