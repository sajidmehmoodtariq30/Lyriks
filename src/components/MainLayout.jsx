import { Outlet } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import TopBar from '../components/TopBar';

// Create context for layout-wide state
export const LayoutContext = createContext(null);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Handle screen resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Layout context value
  const layoutValue = {
    sidebarCollapsed,
    setSidebarCollapsed,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying
  };
  
  return (
    <LayoutContext.Provider value={layoutValue}>
      <div className="flex flex-col h-screen bg-black text-white">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar collapsed={sidebarCollapsed} />
          
          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top navigation bar */}
            <TopBar />
            
            {/* Main content with scrolling */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black p-4">
              <Outlet />
            </main>
          </div>
        </div>
        
        {/* Player fixed at bottom */}
        <Player />
      </div>
    </LayoutContext.Provider>
  );
};

export default MainLayout;