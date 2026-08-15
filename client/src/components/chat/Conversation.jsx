import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from './Message';
import MessageInput from './MessageInput';
import EmptyState from './EmptyState';
import { sendMessageAsync } from '../../features/chat/chatSlice';
import './ChatStyles.css';

const models = [
  { id: 'gpt-4o', name: 'ChatGPT 4o', desc: 'Our most intelligent model for complex tasks', badge: 'Fastest' },
  { id: 'gpt-4o-mini', name: 'ChatGPT 4o-mini', desc: 'Great for everyday tasks and lightweight reasoning' },
  { id: 'o1-preview', name: 'ChatGPT o1', desc: 'Advanced reasoning and step-by-step logic', badge: 'Deep Thinking' },
];

const Conversation = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const activeConversation = useSelector((state) => state.chat.activeConversation);
  const ConversationId = useSelector((state) => state.chat.conversationId);

  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isTemporaryChat, setIsTemporaryChat] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const isChatEmpty = !messages || messages.length === 0;

  // Auto-scroll on new messages
  useEffect(() => {
    if (bottomRef.current && !showScrollBottom) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showScrollBottom]);

  // Track scroll position to show/hide scroll-to-bottom button
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

  const handleRegenerate = () => {
    // Find last user message to resend
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user');
    if (lastUserMsg && lastUserMsg.text) {
      dispatch(sendMessageAsync({ message: lastUserMsg.text, ConversationId }));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-[#212121] text-[#ececec]">
      {/* Top ChatGPT Header Bar */}
      <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-[#2f2f2f] bg-[#212121]/95 px-4 backdrop-blur">
        {/* Left: Sidebar Toggle + Model Selector */}
        <div className="flex items-center gap-2">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#b4b4b4] hover:bg-[#2f2f2f] hover:text-white transition-colors"
              title="Toggle sidebar"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
          )}
          
        </div>

      </header>

      {/* Main Conversation Stream */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth chatgpt-scrollbar"
      >
        {isChatEmpty ? (
          <EmptyState onSelectPrompt={handleSelectPrompt} />
        ) : (
          <div className="flex flex-col pb-6">
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                onRegenerate={message.sender === 'assistant' ? handleRegenerate : undefined}
              />
            ))}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-28 right-8 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-[#3e3e3e] bg-[#2f2f2f] text-white shadow-xl transition-all hover:bg-[#3e3e3e]"
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
