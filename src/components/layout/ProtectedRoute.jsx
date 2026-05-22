import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth()

    if (loading) return <div>Cargando...</div>

    if (!user) return <Navigate to="/login" replace />

    if (allowedRoles && !allowedRoles.includes(profile?.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}