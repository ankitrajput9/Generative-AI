import { useState } from 'react';
import EditorModal from './EditorModal';
import { useDispatch } from 'react-redux';
import { updateMessage } from '../../features/chat/chatSlice';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github.css';

const CodeMessage = ({ message }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSave = (newCode) => {
    dispatch(updateMessage({ id: message.id, text: newCode }));
    setOpen(false);
  };

  return (
    <div className="code-message">
      <div className="rounded border border-slate-100 bg-slate-50 p-3 overflow-auto text-sm">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
          {message.text || ''}
        </ReactMarkdown>
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={() => setOpen(true)} className="text-sm text-slate-600 hover:text-slate-900">Edit</button>
      </div>
      {open && (
        <EditorModal initialCode={message.text} onClose={() => setOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
};

export default CodeMessage;
