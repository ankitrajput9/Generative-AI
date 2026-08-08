import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Message from './Message';
import './ChatStyles.css';
import MessageInput from './MessageInput';

const Conversation = () => {
  const messages = useSelector((state) => state.chat.messages);
  const activeConversation = useSelector((state) => state.chat.activeConversation);
  const containerRef = useRef(null);

  useEffect(() => {
    // auto-scroll to bottom when messages change
    const container = containerRef.current;
    if (container) {
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="text-sm font-medium text-slate-700">{activeConversation || 'New Chat'}</div>
      </div>

      <div ref={containerRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default Conversation;
