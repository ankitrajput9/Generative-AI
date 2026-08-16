import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from './Message';
import MessageInput from './MessageInput';
import EmptyState from './EmptyState';
import { fetchConversations } from '../../features/chat/chatSlice';
import './ChatStyles.css';

const Conversation = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const isChatEmpty = !messages || messages.length === 0;

  // Load chat titles from backend on initial mount
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (bottomRef.current && !showScrollBottom) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showScrollBottom]);

  // Track scroll position
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const isUp = el.scrollHeight - el.scrollTop - el.clientHeight > 150;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollBottom(false);
  };

  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#000000] text-[#ececec]">
      {/* Top Header Bar for Mobile Sidebar Toggle */}
      <header className="sticky top-0 z-20 flex h-12 w-full items-center justify-between px-4 bg-[#000000]/90 backdrop-blur md:hidden">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-[#212121] hover:text-white transition-colors"
            title="Toggle sidebar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
      </header>

      {/* Main Conversation Stream */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth chatgpt-scrollbar"
      >
        <div className="mx-auto max-w-4xl pt-6 pb-4">
          {isChatEmpty ? (
            <EmptyState onSelectPrompt={handleSelectPrompt} />
          ) : (
            <div className="flex flex-col space-y-2">
              {messages.map((message) => (
                <Message key={message.id || message._id} message={message} />
              ))}
              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-white shadow-xl transition-all hover:bg-zinc-700"
          title="Scroll to bottom"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      )}

      {/* Floating Bottom Input Dock */}
      <MessageInput
        initialPrompt={selectedPrompt}
        onPromptCleared={() => setSelectedPrompt('')}
      />
    </div>
  );
};

export default Conversation;

