import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth()
  
    if (!isAuthenticated) {
        // Si no está autenticado, redirige a la página combinada de inicio de sesión y registro
        return <Navigate to="/auth" replace />;
    }

    return <>{children}</>
}

export default ProtectedRoute