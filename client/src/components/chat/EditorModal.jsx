import { useState } from 'react';

const EditorModal = ({ initialCode = '', language = '', onClose, onSave }) => {
  const [code, setCode] = useState(initialCode || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] max-w-3xl rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-3">
          <div className="text-sm font-medium">Edit {language || 'code'}</div>
          <div className="flex items-center gap-2">
            <button onClick={() => onClose?.()} className="text-sm text-slate-600 hover:text-slate-900">Close</button>
            <button
              onClick={() => onSave?.(code)}
              className="rounded bg-slate-900 px-3 py-1 text-sm text-white hover:bg-slate-700"
            >
              Save
            </button>
          </div>
        </div>
        <div className="p-3">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-64 rounded border border-slate-200 p-3 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default EditorModal;
