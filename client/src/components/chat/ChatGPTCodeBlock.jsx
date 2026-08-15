import { useState } from 'react';

// Extract plain text from React children tree for clipboard copy
function extractText(node) {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && node.props && node.props.children) return extractText(node.props.children);
  return '';
}

export const ChatGPTPre = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);

  // Check if first child is a code tag with language class
  const codeElement = Array.isArray(children) ? children[0] : children;
  const className = codeElement?.props?.className || '';
  const langMatch = className.match(/language-([a-zA-Z0-9_-]+)/);
  const language = langMatch ? langMatch[1] : 'code';

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
    <div className="chatgpt-codeblock my-4 overflow-hidden rounded-xl border border-[#383737] bg-[#0d0d0d] shadow-md">
      <div className="flex items-center justify-between bg-[#2f2f2f] px-4 py-2 text-xs font-sans text-[#b4b4b4]">
        <span className="font-medium lowercase tracking-wide text-[#cdcdcd]">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-[#b4b4b4] transition-colors hover:bg-[#383737] hover:text-white"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-4 text-[13px] leading-relaxed text-[#ececec]">
        <pre className="!m-0 !bg-transparent !p-0 !border-0 font-mono" {...props}>
          {children}
        </pre>
      </div>
    </div>
  );
};

export default ChatGPTPre;
