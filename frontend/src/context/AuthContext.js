import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    // verifica se o usuário está autenticado a partir do cookie "user_auth"
    const [isAuthenticated, setIsAuthenticated] = useState(document.cookie.split(";").some((item) => item.trim().startsWith("user_auth=")));

    // Usando a função getUserDataFromCookie para definir userData inicial
    const [userData, setUserData] = useState('');

    useEffect(() => {
        if (isAuthenticated && window.location.pathname === '/') {
            checkAuth();
        }
    }, []);

    const login = (credentials) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await api('post', '/api/auth/login.php', credentials);
                
                if (response.data && response.data.message === "Login realizado com sucesso.") {
                    setIsAuthenticated(true);
                    const user = {
                        name: response.data.user_name,
                        registration: response.data.registration,
                        perfil: response.data.user_perfil,
                        reuseOperators: response.data.reuse_operators,
                        ambient: response.data.ambient
                    };
                    setUserData(user);
                    resolve(true);
                } else {
                    reject(response.data.message);
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    const logout = async () => {
        try {
            await api('get', '/api/auth/logout.php');
            setIsAuthenticated(false);
            setUserData(null);
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Função para recuperar dados do usuário do cookie 'user_auth'
    const getUserDataFromCookie = () => {
        return new Promise(async (_resolve, reject) => {
            try {
                const response = await api('get', '/api/auth/session_data.php');

                if (response.data.session) {
                    const user = {
                        name: response.data.session.user_name,
                        registration: response.data.session.user_registration,
                        perfil: response.data.session.user_perfil,
                        reuseOperators: response.data.session.usingSacOperadores,
                        ambient: response.data.session.ambient
                    };
                    setUserData(user);
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    const checkAuth = async () => {
        try {
            // verifica se o usuário está em uma rota diferente de login
            if (window.location.pathname === '/') {
                const response = await api('get', '/api/auth/check_is_auth.php');

                if (response.status === 200 && response.data.is_auth) {
                    setIsAuthenticated(true);
                    // Definindo userData com base no cookie após a verificação de autenticação bem-sucedida
                    setUserData(getUserDataFromCookie());
                } else {
                    setIsAuthenticated(false);
                }
            }
        } catch (error) {
            setIsAuthenticated(false);
        }
    };



    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };

export const useAuth = () => {
    return useContext(AuthContext);
};
