import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageAsync } from '../../features/chat/chatSlice';

const MessageInput = ({ initialPrompt = '', onPromptCleared }) => {
  const dispatch = useDispatch();
  const ConversationId = useSelector((state) => state.chat.conversationId);
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) {
      setValue(initialPrompt);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
      }
      if (onPromptCleared) onPromptCleared();
    }
  }, [initialPrompt, onPromptCleared]);

  const handleInput = (e) => {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    if (!value.trim()) return;

    dispatch(sendMessageAsync({ message: value.trim(), ConversationId }));
    setValue('');

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = value.trim().length > 0;

  return (
    <div className="w-full bg-[#000000] px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center justify-between rounded-[32px] border border-[#333333] bg-[#222222] px-4 py-2 shadow-xl transition-all focus-within:border-[#555555]"
        >
          {/* Left + action button */}
          <button
            type="button"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer mr-2"
            title="Attach or Add"
          >
            <span className="text-xl font-light leading-none">+</span>
          </button>

          {/* Text input / textarea */}
          <div className="flex-1 flex items-center">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask anything"
              className="max-h-[150px] min-h-[24px] w-full resize-none bg-transparent text-[14.5px] leading-6 text-white placeholder-zinc-400 outline-none"
            />
          </div>

          {/* Right Send pill button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={`flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-medium transition-all ml-2 ${
              canSubmit
                ? 'bg-[#6b7280] text-white hover:bg-zinc-400 active:scale-95 cursor-pointer shadow-sm'
                : 'bg-[#4b5563]/60 text-zinc-400 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </form>

        {/* Conversation ID Footer */}
        <div className="mt-3 text-center text-xs text-zinc-500 font-mono select-all">
          Conversation ID: {ConversationId || '6a81d359b5aa73e98b4ed798'}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;

