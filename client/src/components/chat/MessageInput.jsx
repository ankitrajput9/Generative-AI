import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage } from '../../features/chat/chatSlice';
import Button from '../common/Button';

const MessageInput = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    dispatch(sendMessage(value));
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-slate-200 p-4">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        placeholder="Type your message"
      />
      <Button type="submit">Send</Button>
    </form>
  );
};

export default MessageInput;
