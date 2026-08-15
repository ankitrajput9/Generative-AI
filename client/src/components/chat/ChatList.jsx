import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteConversation, selectConversation } from '../../features/chat/chatSlice';

const ChatList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.chat.conversations || []);
  const activeId = useSelector((state) => state.chat.conversationId);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by timestamp category
  const groups = ['Today', 'Yesterday', 'Previous 7 Days'];

  return (
    <div className="flex h-full flex-col text-[#ececec]">
      {/* Search chats input */}
      <div className="relative mb-3 px-1">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full rounded-lg border border-[#3e3e3e] bg-[#212121] px-3 py-1.5 pl-8 text-xs text-[#ececec] placeholder-[#8e8e8e] outline-none focus:border-[#676767]"
        />
        <svg
          className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-[#8e8e8e]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Grouped Chat History */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1 chatgpt-scrollbar text-xs">
        {groups.map((group) => {
          const items = filteredConversations.filter(
            (c) => (c.timestamp || 'Today') === group
          );
          if (items.length === 0) return null;

          return (
            <div key={group} className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-semibold text-[#8e8e8e]">
                {group}
              </div>
              {items.map((c) => {
                const isActive = c.id === activeId;
                return (
                  <div
                    key={c.id}
                    onClick={() => dispatch(selectConversation(c))}
                    className={`group relative flex items-center justify-between rounded-lg px-2.5 py-2 cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[#212121] text-white font-medium'
                        : 'text-[#cdcdcd] hover:bg-[#212121]/70 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-4 text-xs">{c.title}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteConversation(c.id));
                      }}
                      className="hidden h-5 w-5 items-center justify-center rounded text-[#8e8e8e] hover:text-red-400 group-hover:flex"
                      title="Delete chat"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="px-2 py-4 text-center text-xs text-[#8e8e8e]">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
