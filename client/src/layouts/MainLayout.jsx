import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Conversation from '../components/chat/Conversation';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121] text-[#ececec]">
      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ChatGPT Left Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main ChatGPT Conversation Screen */}
      <main className="flex h-full flex-1 flex-col overflow-hidden">
        <Conversation onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      </main>
    </div>
  );
};

export default MainLayout;
