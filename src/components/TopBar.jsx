import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { spotifyService } from '../services/spotify/api.js';

// Import icons
import {
    HiChevronLeft as ChevronLeftIcon,
    HiChevronRight as ChevronRightIcon,
    HiSearch as SearchIcon,
    HiUser as UserIcon,
    HiLogout as LogoutIcon,
    HiBell as BellIcon
} from 'react-icons/hi';

const TopBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const profileMenuRef = useRef(null);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Handle navigation history
    const handleNavigateBack = () => {
        navigate(-1);
    };

    const handleNavigateForward = () => {
        navigate(1);
    };

    // Close profile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Reset search query when location changes
    useEffect(() => {
        if (!location.pathname.includes('/search')) {
            setSearchQuery('');
        } else if (location.search) {
            // Extract search query from URL if on search page
            const params = new URLSearchParams(location.search);
            const query = params.get('q');
            if (query) {
                setSearchQuery(query);
            }
        }
    }, [location]);

    return (
        <header className="bg-gray-900 p-4 flex items-center justify-between sticky top-0 z-10">
            {/* Navigation controls */}
            <div className="flex items-center">
                <button
                    onClick={handleNavigateBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white mr-2"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>

                <button
                    onClick={handleNavigateForward}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>

                {/* Search bar - Show on search page or when focused */}
                {(location.pathname.includes('/search') || isSearchFocused) && (
                    <form onSubmit={handleSearch} className="ml-4">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                placeholder="What do you want to listen to?"
                                className="bg-gray-800 text-white rounded-full py-2 pl-10 pr-4 w-80 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        </div>
                    </form>
                )}
            </div>

            {/* User profile */}
            <div className="flex items-center space-x-4">
                <button className="text-gray-300 hover:text-white">
                    <BellIcon className="w-6 h-6" />
                </button>

                <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        className="flex items-center space-x-2 bg-black/30 hover:bg-black/60 rounded-full p-1 pr-3 transition-colors"
                    >
                        {user?.images && user.images[0] ? (
                            <img
                                src={user.images[0].url}
                                alt="Profile"
                                className="w-7 h-7 rounded-full"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center">
                                <UserIcon className="w-4 h-4" />
                            </div>
                        )}
                        <span className="text-sm font-medium">{user?.display_name}</span>
                    </button>

                    {/* Profile dropdown menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                            <a
                                href="#profile"
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                Profile
                            </a>
                            <a
                                href="#account"
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                Account
                            </a>
                            <a
                                href="#settings"
                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                Settings
                            </a>
                            <div className="border-t border-gray-700"></div>
                            <button
                                onClick={logout}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                            >
                                <LogoutIcon className="w-4 h-4 mr-2" />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;