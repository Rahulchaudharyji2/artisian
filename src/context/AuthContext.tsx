"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: 'user' | 'artisan';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
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
        const savedUserRole = localStorage.getItem('artisanRole'); // Get role

        if (savedUserId && savedUserName) {
            setUser({
                _id: savedUserId,
                name: savedUserName,
                email: savedUserEmail || '',
                image: savedUserImage || undefined,
                role: savedUserRole === 'artisan' ? 'artisan' : 'user'
            });
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('artisanId', userData._id);
        localStorage.setItem('artisanName', userData.name);
        localStorage.setItem('artisanEmail', userData.email);
        localStorage.setItem('artisanRole', userData.role); // Save role
        if (userData.image) localStorage.setItem('artisanImage', userData.image);
    };

    const logout = () => {
        setUser(null);
        localStorage.clear(); // Clear EVERYTHING to ensure no stale artisan data
        window.location.href = '/'; // Force full page reload
    };

    const updateUser = (userData: Partial<User>) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...userData };
            localStorage.setItem('artisanName', updated.name);
            if (updated.image) localStorage.setItem('artisanImage', updated.image);
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isLoading, 
            login, 
            logout, 
            updateUser,
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
