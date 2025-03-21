import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { spotifyService } from '../services/spotify/api.js';
import { useAuth } from '../context/AuthContext.jsx';

// Import icons
import {
    HiHome  as HomeIcon,
    HiSearch  as SearchIcon,
    HiLibrary as LibraryIcon,
    HiPlusCircle as PlusCircleIcon,
    HiHeart as HeartIcon,
} from 'react-icons/hi';

const Sidebar = ({ collapsed }) => {
    const location = useLocation();
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch user playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await spotifyService.getUserPlaylists();
                setPlaylists(response.data.items);
            } catch (error) {
                console.error('Error fetching playlists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, []);

    // Navigation items
    const navItems = [
        { name: 'Home', path: '/', icon: <HomeIcon className="w-6 h-6" /> },
        { name: 'Search', path: '/search', icon: <SearchIcon className="w-6 h-6" /> },
        { name: 'Your Library', path: '/library', icon: <LibraryIcon className="w-6 h-6" /> },
    ];

    // Library items
    const libraryItems = [
        { name: 'Create Playlist', path: '/create-playlist', icon: <PlusCircleIcon className="w-6 h-6" /> },
        { name: 'Liked Songs', path: '/liked-songs', icon: <HeartIcon className="w-6 h-6" /> },
    ];

    return (
        <div
            className={`bg-black flex flex-col transition-all duration-300 ease-in-out ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="p-6">
                <Link to="/" className="flex items-center">
                    {collapsed ? (
                        <span className="text-3xl font-bold text-green-500">S</span>
                    ) : (
                        <span className="text-2xl font-bold text-white">Spotify Clone</span>
                    )}
                </Link>
            </div>

            {/* Main navigation */}
            <nav className="mb-6">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-6 py-3 transition-colors ${location.pathname === item.path
                                        ? 'text-white bg-gray-800'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <span className="mr-4">{item.icon}</span>
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Library section */}
            <div className="px-6 mb-2">
                {!collapsed && <h2 className="text-lg font-semibold text-gray-200 mb-2">Your Library</h2>}
            </div>

            <nav className="mb-4">
                <ul>
                    {libraryItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-6 py-3 transition-colors ${location.pathname === item.path
                                        ? 'text-white bg-gray-800'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                <span className="mr-4">{item.icon}</span>
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Playlists section */}
            {!collapsed && (
                <>
                    <div className="px-6 mb-2">
                        <h2 className="text-lg font-semibold text-gray-200">Playlists</h2>
                    </div>

                    <div className="overflow-y-auto flex-1 px-2">
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                            </div>
                        ) : (
                            <ul className="space-y-1">
                                {playlists.map((playlist) => (
                                    <li key={playlist.id}>
                                        <Link
                                            to={`/playlist/${playlist.id}`}
                                            className="block px-4 py-2 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors truncate"
                                        >
                                            {playlist.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;