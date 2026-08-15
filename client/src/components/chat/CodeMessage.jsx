import { useMemo, useState } from 'react';
import EditorModal from './EditorModal';
import { useDispatch } from 'react-redux';
import { updateMessage } from '../../features/chat/chatSlice';

const CodeMessage = ({ message }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const parsedCode = useMemo(() => {
    const raw = message.text || '';
    const fenceMatch = raw.match(/```(\w+)?\s*\n([\s\S]*?)```/);

    if (fenceMatch) {
      return {
        language: fenceMatch[1] || 'plaintext',
        code: fenceMatch[2].trim(),
      };
    }

    return {
      language: 'plaintext',
      code: raw.trim(),
    };
  }, [message.text]);

  const handleSave = (newCode) => {
    dispatch(updateMessage({ id: message.id, text: newCode }));
    setOpen(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(parsedCode.code);
    } catch (error) {
      console.error('Copy failed', error);
    }
  };

  return (
    <div className="code-message w-full min-w-[280px]">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-[#1e1e1e] shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-700 bg-[#1f1f1f] px-3 py-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <span className="uppercase tracking-wide text-slate-400">{parsedCode.language}</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="text-slate-300 hover:text-white">Copy</button>
            <button onClick={() => setOpen(true)} className="text-slate-300 hover:text-white">Edit</button>
          </div>
        </div>

        <pre className="max-h-[420px] overflow-auto bg-[#1e1e1e] p-3 text-left text-xs leading-6 text-slate-100">
          <code>{parsedCode.code}</code>
        </pre>
      </div>

      {open && (
        <EditorModal initialCode={parsedCode.code} language={parsedCode.language} onClose={() => setOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
};

export default CodeMessage;
