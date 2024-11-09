import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

// Interceptor de solicitudes para añadir el token de acceso a cada petición
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Interceptor de respuestas para manejar la expiración del token de acceso
api.interceptors.response.use(
    response => response, // Si la respuesta es exitosa, simplemente se devuelve
    async (error) => {
        const originalRequest = error.config;

        // Si obtenemos un 401 (no autorizado), significa que el `access_token` ha expirado
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Obtener el refresh token del localStorage
            const refreshToken = localStorage.getItem("refresh_token");

            // Si existe el refresh token, intenta renovar el access token
            if (refreshToken) {
                try {
                    // Realiza una solicitud para obtener un nuevo access token
                    const refreshResponse = await axios.post('http://127.0.0.1:8000/user/token/refresh', {
                        refresh_token: refreshToken
                    });

                    const { access_token } = refreshResponse.data;

                    // Almacena el nuevo access token en el localStorage
                    localStorage.setItem("access_token", access_token);

                    // Reintenta la solicitud original con el nuevo access token
                    originalRequest.headers.Authorization = `Bearer ${access_token}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Error al refrescar el token:", refreshError);
                    // Si el refresh token también falla, se realiza el logout
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/auth"; // Redirige al usuario al login
                }
            } else {
                // Si no hay refresh token, redirige al login
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/auth";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
