import { useState, useEffect } from 'react';
import { spotifyService } from '../services/spotify/api';
import { logout } from '../services/spotify/auth';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await spotifyService.getCurrentUser();
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="text-center">
                    <p className="text-red-400">{error}</p>
                    <button
                        onClick={handleLogout}
                        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Spotify Clone</h1>

                    {user && (
                        <div className="flex items-center space-x-4">
                            {user.images && user.images[0] ? (
                                <img
                                    src={user.images[0].url}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                                    <span>{user.display_name.charAt(0)}</span>
                                </div>
                            )}
                            <span>{user.display_name}</span>
                            <button
                                onClick={handleLogout}
                                className="px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </header>

                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Authentication Successful!</h2>
                    <p>Your Spotify API connection is working correctly.</p>

                    {user && (
                        <div className="mt-4">
                            <p>Account details:</p>
                            <ul className="list-disc list-inside ml-4 mt-2">
                                <li>Username: {user.id}</li>
                                <li>Email: {user.email}</li>
                                <li>Subscription: {user.product}</li>
                                <li>Country: {user.country}</li>
                                <li>Followers: {user.followers?.total || 0}</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;