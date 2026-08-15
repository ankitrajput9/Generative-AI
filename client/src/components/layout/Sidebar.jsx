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
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#171717] p-3 text-[#ececec] transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Top Header: Logo + New Chat */}
      <div className="mb-3 flex items-center justify-between px-1 py-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#212121] border border-[#3e3e3e] shadow-sm">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">ChatGPT</span>
        </div>

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

      {/* New Chat Button */}
      <button
        type="button"
        onClick={handleNewChat}
        className="mb-3 flex w-full items-center justify-between rounded-xl border border-[#383737] bg-[#212121] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#2a2a2a] hover:border-[#4d4d4d]"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2f2f2f]">
            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span>New chat</span>
        </div>

        <svg className="h-3.5 w-3.5 text-[#8e8e8e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </button>

      {/* Chat History List */}
      <div className="flex-1 overflow-hidden">
        <ChatList />
      </div>

      {/* Bottom Profile Section */}
      <div className="mt-3 border-t border-[#262626] pt-3">
        {/* Upgrade Plan Pill */}
        <div className="mb-2 flex items-center justify-between rounded-xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-800/30 p-2.5 text-xs text-[#ececec]">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <div>
              <div className="font-semibold text-white">Upgrade plan</div>
              <div className="text-[10px] text-[#8e8e8e]">More access to GPT-4o</div>
            </div>
          </div>
          <button className="rounded-lg bg-white/10 px-2 py-1 text-[11px] font-medium text-white hover:bg-white/20">
            Upgrade
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center justify-between rounded-xl p-2 hover:bg-[#212121] transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="truncate text-xs font-medium text-[#ececec]">
              {user?.name || user?.email || 'User'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch(logoutUser())}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#8e8e8e] hover:bg-[#2f2f2f] hover:text-white transition-colors"
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
