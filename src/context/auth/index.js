import { createContext } from "react";

const defaultProvider = {
    user: null,
    loading: true,
    setUser: () => null,
    setLoading: () => Boolean,
    refreshTokenValue: null,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    verifyToken: () => Promise.resolve(),
    hasPermission: () => Boolean
}

const AuthContext = createContext(defaultProvider);

export default AuthContext;