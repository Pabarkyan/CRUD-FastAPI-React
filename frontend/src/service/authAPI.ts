import api from "./api";


export const loginUser = async (email: string, password: string): Promise<{ access_token: string, refresh_token: string } | null> => {
    try {
        const response = await api.post('/user/token', new URLSearchParams({ username: email, password }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        const { access_token, refresh_token } = response.data;
        return { access_token, refresh_token };
    } catch (error) {
        console.error("Error en el inicio de sesión", error);
        return null;
    }
};

export const registerUser = async (username: string, email: string, password: string): Promise<{ access_token: string, refresh_token: string } | null> => {
    try {
        const response = await api.post('/user/register', { username, email, password });
        const { access_token, refresh_token } = response.data;
        return { access_token, refresh_token };
    } catch (error) {
        console.error("Error en el registro", error);
        return null;
    }
};
