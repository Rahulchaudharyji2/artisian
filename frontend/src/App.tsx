import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import AITools from './pages/AITools';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreatePost from './pages/CreatePost';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-karigar-bg">Loading qala...</div>;
    
    if (!isAuthenticated) return <Navigate to="/" replace />;
    
    return <>{children}</>;
};

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Auth page is the root. If already authenticated, redirect to discover or profile */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/discover" replace /> : <Auth />} />
            
            {/* All other routes are protected */}
            <Route path="/discover" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/ai-tools" element={<ProtectedRoute><AITools /></ProtectedRoute>} />
            <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
            
            {/* Admin routes remain separate */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
    );
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter
                future={{
                    v7_startTransition: true,
                    v7_relativeSplatPath: true,
                }}
            >
                <div className="min-h-screen bg-karigar-bg text-stone-900 font-sans">
                    <main className="w-full min-h-screen flex flex-col relative overflow-hidden">
                        <AppRoutes />
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
