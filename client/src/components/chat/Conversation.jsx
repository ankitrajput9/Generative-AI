import { useSelector } from 'react-redux';
import Message from './Message';
import MessageInput from './MessageInput';

const Conversation = () => {
  const messages = useSelector((state) => state.chat.messages);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default Conversation;
