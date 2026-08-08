import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageAsync } from '../../features/chat/chatSlice';
import Button from '../common/Button';

const MessageInput = () => {
  const dispatch = useDispatch();
  const ConversationId = useSelector((state) => state.chat.conversationId);
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    if (!value.trim()) return;
    dispatch(sendMessageAsync({ message: value, ConversationId }));
    setValue('');
    // focus back to textarea
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-4">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        className="flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        placeholder="Type your message (Shift+Enter for newline)"
      />
      <Button type="submit">Send</Button>
    </form>
  );
};

export default MessageInput;
