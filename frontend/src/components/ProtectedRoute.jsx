import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import RoleSelection from './RoleSelection'

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()
    const token = localStorage.getItem('accessToken')

    if (!token) {
        return <Navigate to="/" replace />
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-brand-600 animate-spin" />
            </div>
        )
    }

    if (user && !user.role) {
        return <RoleSelection onRoleSelected={() => {}} />
    }

    return children
}
