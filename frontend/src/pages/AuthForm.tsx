import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { loginUser, registerUser } from "../service/authAPI";

function AuthForm() {
    const { login } = useAuth();
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    
    const toggleAuthMode = () => {
        setIsRegistering(!isRegistering);
        setEmail('');
        setPassword('');
        setUsername('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isRegistering) {
            const tokens = await registerUser(username, email, password);
            if (tokens) {
                login(tokens); // Pasa ambos tokens a login
            } else {
                alert('Error en el registro');
            }
        } else {
            const tokens = await loginUser(email, password);
            if (tokens) {
                login(tokens); // Pasa ambos tokens a login
            } else {
                alert("Error en el inicio de sesión");
            }
        }
    };
    
    return (
        <div className="bg-slate-400 flex justify-center items-center p-16 min-w-screen min-h-screen">
            <div className="bg-gray-200 rounded-lg flex gap-12 flex-col p-8 justify-center items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    {isRegistering ? 'Registro' : 'Inicio de Sesión'}
                </h2>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    {isRegistering && (
                        <input
                            className="outline-none px-4 py-2 rounded-lg"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nombre de usuario"
                            required
                        />
                    )}
                    <input
                        className="outline-none px-4 py-2 rounded-lg"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        required
                    />
                    <input
                        className="outline-none px-4 py-2 rounded-lg"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        required
                    />
                    <button type="submit"
                        className="px-6 py-4 bg-slate-300 rounded-full transition-all hover:bg-slate-50"
                    >
                        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
                    </button>
                </form>
                <p className="flex gap-2 flex-col">
                    {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes una cuenta?'}
                    <button className="hover:text-slate-400" onClick={toggleAuthMode}>
                        {isRegistering ? 'Inicia sesión' : 'Regístrate'}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default AuthForm;
