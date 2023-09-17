import axios from 'axios';

import envJson from '../env.json';

export const baseURL = (window.location.hostname === "localhost"
    ? (envJson.development.base_path)
    : (envJson.production.base_path)
);

const api = async (method, rota, data) => {
    // Configura o cabeçalho para enviar credenciais (cookies)
    const headers = { withCredentials: true };      

    try {
        let response;
        switch (method) {
            case 'get':
                response = await axios.get(`${baseURL}${rota}`, headers);
                break;
            case 'post':
                response = await axios.post(`${baseURL}${rota}`, data, headers);
                break;
            case 'put':
                response = await axios.put(`${baseURL}${rota}`, data, headers);
                break;
            case 'delete':
                response = await axios.delete(`${baseURL}${rota}`, headers);
                break;
            default:
                throw new Error('Método inválido');
        }
        return response;
    } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
    }
};

export default api;
