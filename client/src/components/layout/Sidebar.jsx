import { useDispatch, useSelector } from 'react-redux';
import ChatList from '../chat/ChatList';
import { startNewChat } from '../../features/chat/chatSlice';
import { logoutUser } from '../../features/auth/authSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleNewChat = () => {
    dispatch(startNewChat());
    if (onClose) onClose();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#0d0d0d] border-r border-[#1e1e1e] p-3 text-[#ececec] transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Top Header: ChatGPT Brand */}
      <div className="mb-4 flex items-center justify-between px-2 pt-2">
        <h1 className="text-xl font-bold tracking-tight text-white select-none">
          ChatGPT
        </h1>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8e8e8e] hover:bg-[#212121] hover:text-white md:hidden"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* + New Chat Button */}
      <button
        type="button"
        onClick={handleNewChat}
        className="mb-4 flex w-full items-center gap-2 rounded-xl border border-[#2f2f2f] bg-[#171717] px-3.5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#222222] hover:border-[#444444]"
      >
        <span className="text-base font-light text-zinc-400">+</span>
        <span>New chat</span>
      </button>

      {/* Chat History List */}
      <div className="flex-1 overflow-hidden">
        <ChatList />
      </div>

      {/* Bottom Footer Section */}
      <div className="mt-2 border-t border-[#1e1e1e] pt-3 px-1">
        <div className="flex items-center justify-between py-1">
          <div className="truncate text-xs font-medium text-[#8e8e8e] hover:text-white transition-colors cursor-pointer">
            {user?.name || 'MERN Boilerplate'}
          </div>

          <button
            type="button"
            onClick={() => dispatch(logoutUser())}
            className="flex h-6 w-6 items-center justify-center rounded text-[#8e8e8e] hover:bg-[#212121] hover:text-white transition-colors"
            title="Log out"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

