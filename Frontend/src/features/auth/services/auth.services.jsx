import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '');

const api = axios.create({
    baseURL: `${API_URL}/api/auth`,
    withCredentials: true
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/register', {
            username,
            email,
            password
        });

        return response.data;

    } catch (err) {
        console.error('Register API Error:', err);

        throw new Error(
            err.response?.data?.message || err.message || "Something went wrong"
        );
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post('/login', {
            email,
            password
        });

        return response.data;

    } catch (err) {
        console.error('Login API Error:', err);

        throw new Error(
            err.response?.data?.message || err.message || "Something went wrong"
        );
    }
}

export async function logout() {
    try {
        const response = await api.get('/logout');
        return response.data;

    } catch (err) {
        console.error('Logout API Error:', err);

        throw new Error(
            err.response?.data?.message || err.message || "Something went wrong"
        );
    }
}

export async function getme() {
    try {
        const response = await api.get('/getme');
        return response.data;

    } catch (err) {
        console.error('GetMe API Error:', err);

        throw new Error(
            err.response?.data?.message || err.message || "Something went wrong"
        );
    }
}