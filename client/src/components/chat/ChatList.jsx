import { useDispatch, useSelector } from 'react-redux';
import { loadConversation, deleteConversationAsync } from '../../features/chat/chatSlice';

const ChatList = () => {
  const dispatch = useDispatch();
  const conversations = useSelector((state) => state.chat.conversations || []);
  const activeId = useSelector((state) => state.chat.conversationId);

  if (conversations.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-xs text-zinc-500">
        No conversations yet
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col space-y-1.5 overflow-y-auto pr-1 chatgpt-scrollbar text-xs">
      {conversations.map((c) => {
        const id = c._id || c.id;
        const isActive = id === activeId;

        return (
          <div
            key={id}
            onClick={() => dispatch(loadConversation(c))}
            className={`group relative flex items-center justify-between rounded-xl px-3.5 py-3 cursor-pointer transition-all duration-150 ${
              isActive
                ? 'bg-[#282828] text-white font-normal shadow-sm border border-[#383838]'
                : 'text-zinc-400 hover:bg-[#1f1f1f] hover:text-zinc-200'
            }`}
          >
            <span className="truncate pr-3 text-xs leading-snug">{c.title}</span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteConversationAsync(id));
              }}
              className="hidden h-5 w-5 items-center justify-center rounded text-zinc-500 hover:text-red-400 group-hover:flex transition-colors"
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
};

export default ChatList;

