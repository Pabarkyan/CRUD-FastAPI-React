import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContextProps, AuthContextProviderProps } from "../types/types.user";


export const AuthContext = createContext<AuthContextProps | undefined>(undefined)


export const AuthProvider = ({ children }: AuthContextProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('access_token'))
    const navigate = useNavigate()

    console.log(isAuthenticated)

    const login = ({ access_token, refresh_token }: { access_token: string, refresh_token: string }) => {
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('refresh_token', refresh_token)
        setIsAuthenticated(true)
        navigate('/') // de forma default le llevamos al dashboard cuando se loguee
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        navigate('/auth');
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            login,
            logout
        }} >
            {children}
        </AuthContext.Provider>
    )
}