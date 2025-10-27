import { useContext, createContext } from "react";

const defaultProvider = {
    user: null,
    loading: true,
    setUser: () => null,
    setLoading: () => Boolean,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    verifyToken: () => Promise.resolve()
}

export const AuthContext = createContext(defaultProvider);

export const useAuth = () => {
    return useContext(AuthContext);
};