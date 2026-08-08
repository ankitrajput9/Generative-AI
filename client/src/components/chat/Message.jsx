import CodeMessage from './CodeMessage';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
            AI
          </div>
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-sm break-words leading-6 shadow-sm ${
            isUser ? 'bg-slate-900 text-white' : 'bg-white text-slate-800 border border-slate-100'
          }`}
        >
          {message.type === 'code' ? <CodeMessage message={message} /> : (message.text || (message.sender === 'assistant' ? <TypingIndicator /> : ''))}
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-xs font-semibold text-white">
            You
          </div>
        </div>
      )}
    </div>
  );
};

const TypingIndicator = () => (
  <span className="typing-dots inline-flex items-center gap-1">
    <span className="dot bg-slate-400" />
    <span className="dot bg-slate-400" />
    <span className="dot bg-slate-400" />
  </span>
);

export default Message;
