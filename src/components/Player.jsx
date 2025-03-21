import { useState, useEffect, useRef } from 'react';
import { useLayout } from './MainLayout.jsx';

// Import icons
import {
    HiPlay as PlayIcon,
    HiPause as PauseIcon,
    HiFastForward  as FastForwardIcon,
    HiRewind as RewindIcon,
    HiVolumeUp as VolumeUpIcon,
    HiVolumeOff as VolumeOffIcon,
    HiSwitchHorizontal as SwitchHorizontalIcon,
    HiRefresh as RefreshIcon,
} from 'react-icons/hi';

const Player = () => {
    const { currentTrack, isPlaying, setIsPlaying } = useLayout();
    const [volume, setVolume] = useState(70);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [repeat, setRepeat] = useState(false);
    const [shuffle, setShuffle] = useState(false);

    const progressRef = useRef(null);
    const volumeRef = useRef(null);

    // Track progress
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                // This would update with the actual player's current time
                // For now we'll simulate progress
                setCurrentTime((prev) => {
                    if (prev >= duration) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isPlaying, duration, setIsPlaying]);

    // Handle track change
    useEffect(() => {
        if (currentTrack) {
            // Reset player state for new track
            setCurrentTime(0);
            setDuration(currentTrack.duration_ms / 1000);
            setIsPlaying(true);
        }
    }, [currentTrack, setIsPlaying]);

    // Format time in MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Handle progress bar click
    const handleProgressChange = (e) => {
        const rect = progressRef.current.getBoundingClientRect();
        const position = (e.clientX - rect.left) / rect.width;
        setCurrentTime(position * duration);

        // This would seek the player in a real implementation
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);

        // This would update the player volume in a real implementation
    };

    // Toggle mute
    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (isMuted) {
            setVolume(volume || 70); // Restore previous volume if it was 0
        } else {
            // Store current volume before muting
            setVolume(0);
        }
    };

    return (
        <div className="bg-gray-900 border-t border-gray-800 py-3 px-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Current track info */}
                <div className="w-1/4 flex items-center">
                    {currentTrack ? (
                        <>
                            <img
                                src={currentTrack.album?.images[0]?.url || '/album-placeholder.jpg'}
                                alt={currentTrack.name}
                                className="w-14 h-14 object-cover shadow-lg"
                            />
                            <div className="ml-3">
                                <div className="text-white text-sm font-medium truncate max-w-[180px]">
                                    {currentTrack.name}
                                </div>
                                <div className="text-gray-400 text-xs truncate max-w-[180px]">
                                    {currentTrack.artists?.map(a => a.name).join(', ')}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-400 text-sm">Not playing</div>
                    )}
                </div>

                {/* Playback controls */}
                <div className="flex flex-col items-center w-2/4">
                    <div className="flex items-center space-x-4 mb-2">
                        <button
                            className={`text-gray-400 hover:text-white ${shuffle ? 'text-green-500' : ''}`}
                            onClick={() => setShuffle(!shuffle)}
                        >
                            <SwitchHorizontalIcon className="w-5 h-5" />
                        </button>

                        <button className="text-gray-400 hover:text-white">
                            <RewindIcon className="w-5 h-5" />
                        </button>

                        <button
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? (
                                <PauseIcon className="w-5 h-5 text-black" />
                            ) : (
                                <PlayIcon className="w-5 h-5 text-black" />
                            )}
                        </button>

                        <button className="text-gray-400 hover:text-white">
                            <FastForwardIcon className="w-5 h-5" />
                        </button>

                        <button
                            className={`text-gray-400 hover:text-white ${repeat ? 'text-green-500' : ''}`}
                            onClick={() => setRepeat(!repeat)}
                        >
                            <RefreshIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full flex items-center space-x-2">
                        <span className="text-xs text-gray-400 w-8 text-right">
                            {formatTime(currentTime)}
                        </span>

                        <div
                            ref={progressRef}
                            className="flex-1 h-1 bg-gray-700 rounded-full relative cursor-pointer"
                            onClick={handleProgressChange}
                        >
                            <div
                                className="absolute h-full bg-gray-400 rounded-full hover:bg-green-500"
                                style={{ width: `${(currentTime / duration) * 100}%` }}
                            ></div>
                        </div>

                        <span className="text-xs text-gray-400 w-8">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Volume controls */}
                <div className="w-1/4 flex justify-end items-center space-x-3">
                    <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                        {isMuted ? (
                            <VolumeOffIcon className="w-5 h-5" />
                        ) : (
                            <VolumeUpIcon className="w-5 h-5" />
                        )}
                    </button>

                    <input
                        ref={volumeRef}
                        type="range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-24 accent-white"
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;