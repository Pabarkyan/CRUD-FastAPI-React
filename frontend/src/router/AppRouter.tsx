import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import DashBoard from '../pages/DashBoard'
import AuthForm from '../pages/AuthForm'
import { TaskProvider } from '../context/task'
import { PopUpProvider } from '../context/popup'

const AppRouter: React.FC = () => (
    <Routes>
        {/* Rutas publicas */}
        <Route path='/auth' element={<AuthForm />} />
        
        {/* Rutas Privadas */}
        <Route
            path='/'
            element={
                <ProtectedRoute>
                    <PopUpProvider>
                        <TaskProvider>
                            <DashBoard /> 
                        </TaskProvider>
                    </PopUpProvider>
                </ProtectedRoute>
            }
        />

        {/* Rutas para manejar errores y urls no existentes */}
        {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
)

export default AppRouter