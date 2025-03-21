import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuthUrl, isTokenValid } from '../services/spotify/auth';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const error = location.state?.error;

    useEffect(() => {
        // If user is already authenticated, redirect to home
        if (isTokenValid()) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = () => {
        // Redirect to Spotify authorization page
        window.location.href = getAuthUrl();
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold">
                        Spotify Clone
                    </h2>
                    <p className="mt-2 text-gray-400">Sign in with your Spotify account</p>
                </div>

                {error && (
                    <div className="bg-red-900/50 border border-red-500 p-3 rounded text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <div className="mt-8">
                    <button
                        onClick={handleLogin}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                        Login with Spotify
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        <p>This application requires a Spotify account.</p>
                        <p className="mt-1">You will be redirected to Spotify to authorize access.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;