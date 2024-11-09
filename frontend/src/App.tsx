import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import AppRouter from './router/AppRouter';


function App() {
    return (
        <Router>
            <AuthProvider >
                <AppRouter />
            </AuthProvider>
        </Router>
    )
}

export default App