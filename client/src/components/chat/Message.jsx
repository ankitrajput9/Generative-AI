import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/atom-one-dark.css';
import ChatGPTPre from './ChatGPTCodeBlock';
import './ChatStyles.css';

const Message = ({ message }) => {
  const isUser = message.sender === 'user';
  const content = message.text || '';

  let cleanContent = content;
  if (typeof cleanContent === 'string' && cleanContent.includes('data:')) {
    cleanContent = cleanContent.replace(/(^|\n)data:\s*/g, '$1').replace(/\s+data:\s+/g, ' ');
  }

  if (isUser) {
    return (
      <div className="flex w-full justify-end py-3 px-4">
        <div className="max-w-2xl rounded-full bg-[#f3f4f6] px-5 py-2.5 text-[14.5px] font-normal text-zinc-900 shadow-sm leading-relaxed">
          <div className="whitespace-pre-wrap break-words">{cleanContent}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start py-3 px-4 text-[#ececec]">
      <div className="w-full max-w-3xl">
        {!cleanContent ? (
          <TypingIndicator />
        ) : (
          <div className="chatgpt-markdown-body text-[15px] leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ChatGPTPre,
              }}
            >
              {cleanContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

const TypingIndicator = () => (
  <div className="flex items-center gap-1.5 py-2">
    <span className="h-2 w-2 rounded-full bg-zinc-400 animate-pulse" />
    <span className="h-2 w-2 rounded-full bg-zinc-400 animate-pulse [animation-delay:200ms]" />
    <span className="h-2 w-2 rounded-full bg-zinc-400 animate-pulse [animation-delay:400ms]" />
  </div>
);

export default Message;

