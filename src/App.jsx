import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isTokenValid } from './services/spotify/auth';
import { AuthProvider, useAuth } from './context/AuthContext';

// Import pages
import Login from './pages/Login';
import Callback from './pages/Callback';
import Home from './pages/Home';
// import Search from './pages/Search';
// import Library from './pages/Library';
// import Playlist from './pages/Playlist';
// import Album from './pages/Album';
// import Artist from './pages/Artist';
import MainLayout from './components/MainLayout';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

// App routes configuration
function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/callback" element={<Callback />} />

            {/* Protected routes using main layout */}
            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                <Route index element={<Home />} />
                {/* <Route path="search" element={<Search />} />
                <Route path="library" element={<Library />} />
                <Route path="playlist/:id" element={<Playlist />} />
                <Route path="album/:id" element={<Album />} />
                <Route path="artist/:id" element={<Artist />} /> */}
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;