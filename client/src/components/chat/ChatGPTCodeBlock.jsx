import { useState } from 'react';

function extractText(node) {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && node.props && node.props.children) return extractText(node.props.children);
  return '';
}

export const ChatGPTPre = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const rawText = extractText(children);
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="chatgpt-codeblock group relative my-4 overflow-hidden rounded-2xl border border-[#262b3a] bg-[#121620] shadow-xl">
      {/* Subtle Copy Button in corner */}
      <div className="absolute right-3 top-3 z-10">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-[#1e2433]/80 px-2.5 py-1 text-xs text-zinc-300 opacity-0 backdrop-blur transition-all duration-150 hover:bg-[#2a3247] hover:text-white group-hover:opacity-100"
          title="Copy code"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-5 text-[14px] leading-relaxed font-mono">
        <pre className="!m-0 !bg-transparent !p-0 !border-0 font-mono text-zinc-200" {...props}>
          {children}
        </pre>
      </div>
    </div>
  );
};

export default ChatGPTPre;

