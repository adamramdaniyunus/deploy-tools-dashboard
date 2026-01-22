import { createContext, useState } from "react";
import { authService } from "../services/api";
import { useContext } from "react";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const {data: response} = await authService.login(email, password);
            if (response.success) {
                setToken(response.token);
                localStorage.setItem('token', JSON.stringify(response.token));
                localStorage.setItem('user', JSON.stringify(response.user));
                setUser(response.user);
                window.location.href = '/';
            }
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const value = {
        user,
        loading,
        error,
        token,
        login,
        logout,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
    return useContext(UserContext);
};

export default UserContext;