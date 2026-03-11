import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hydrate state from localStorage on mount
        const savedUserId = localStorage.getItem('artisanId');
        const savedUserName = localStorage.getItem('artisanName');
        const savedUserImage = localStorage.getItem('artisanImage');
        const savedUserEmail = localStorage.getItem('artisanEmail');

        if (savedUserId && savedUserName) {
            setUser({
                _id: savedUserId,
                name: savedUserName,
                email: savedUserEmail || '',
                image: savedUserImage || undefined
            });
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('artisanId', userData._id);
        localStorage.setItem('artisanName', userData.name);
        localStorage.setItem('artisanEmail', userData.email);
        if (userData.image) localStorage.setItem('artisanImage', userData.image);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('artisanId');
        localStorage.removeItem('artisanName');
        localStorage.removeItem('artisanEmail');
        localStorage.removeItem('artisanImage');
        localStorage.removeItem('adminToken'); // Also clear admin token if any
        window.location.href = '/'; // Redirect to auth page
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            login, 
            logout, 
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
