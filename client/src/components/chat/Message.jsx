import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';
import ChatGPTPre from './ChatGPTCodeBlock';
import './ChatStyles.css';

const Message = ({ message, onRegenerate }) => {
  const isUser = message.sender === 'user';
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(null); // 'up' | 'down' | null
  const [speaking, setSpeaking] = useState(false);

  const content = message.text || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = content.replace(/```[\s\S]*?```/g, 'Code block omitted.');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full py-4 transition-colors">
      <div className="mx-auto flex max-w-3xl items-start gap-4 px-4">
        {/* Avatar */}
        <div className="flex-shrink-0 pt-0.5">
          {isUser ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#525252] text-xs font-semibold text-white shadow-sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3e3e3e] bg-[#212121] text-white shadow-sm ring-1 ring-white/10">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="min-w-0 flex-1">
          {/* Sender label */}
          <div className="mb-1 text-sm font-semibold text-[#ececec]">
            {isUser ? 'You' : 'ChatGPT'}
          </div>

          {isUser ? (
            <div className="inline-block rounded-2xl bg-[#2f2f2f] px-4 py-2.5 text-[15px] leading-relaxed text-[#ececec] shadow-sm">
              <div className="whitespace-pre-wrap break-words">{content}</div>
            </div>
          ) : (
            <div className="text-[15px] leading-relaxed text-[#ececec]">
              {!content ? (
                <TypingIndicator />
              ) : (
                <div className="chatgpt-markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      pre: ChatGPTPre,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Action Bar for AI response */}
              {content && (
                <div className="mt-3 flex items-center gap-1 text-[#8e8e8e]">
                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#2f2f2f] hover:text-white transition-colors"
                    title={copied ? 'Copied' : 'Copy message'}
                  >
                    {copied ? (
                      <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    )}
                  </button>

                  {/* Read Aloud Button */}
                  <button
                    type="button"
                    onClick={handleSpeak}
                    className={`flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#2f2f2f] hover:text-white transition-colors ${speaking ? 'text-blue-400' : ''}`}
                    title={speaking ? 'Stop speaking' : 'Read aloud'}
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>

                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => setLiked(liked === 'up' ? null : 'up')}
                    className={`flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#2f2f2f] hover:text-white transition-colors ${liked === 'up' ? 'text-emerald-400' : ''}`}
                    title="Good response"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                  </button>

                  {/* Dislike Button */}
                  <button
                    type="button"
                    onClick={() => setLiked(liked === 'down' ? null : 'down')}
                    className={`flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#2f2f2f] hover:text-white transition-colors ${liked === 'down' ? 'text-red-400' : ''}`}
                    title="Bad response"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                    </svg>
                  </button>

                  {/* Regenerate Button */}
                  {onRegenerate && (
                    <button
                      type="button"
                      onClick={onRegenerate}
                      className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[#2f2f2f] hover:text-white transition-colors"
                      title="Regenerate response"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10" />
                        <polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 py-1">
    <span className="h-2 w-2 rounded-full bg-[#8e8e8e] animate-pulse" />
    <span className="h-2 w-2 rounded-full bg-[#8e8e8e] animate-pulse [animation-delay:200ms]" />
    <span className="h-2 w-2 rounded-full bg-[#8e8e8e] animate-pulse [animation-delay:400ms]" />
  </div>
);

export default Message;
