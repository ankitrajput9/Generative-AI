import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageAsync } from '../../features/chat/chatSlice';

const MessageInput = ({ initialPrompt = '', onPromptCleared }) => {
  const dispatch = useDispatch();
  const ConversationId = useSelector((state) => state.chat.conversationId);
  const [value, setValue] = useState('');
  const [isWebSearchActive, setIsWebSearchActive] = useState(false);
  const [isReasoningActive, setIsReasoningActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  // Sync initial prompt when clicked from suggestion cards
  useEffect(() => {
    if (initialPrompt) {
      setValue(initialPrompt);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
      }
      if (onPromptCleared) onPromptCleared();
    }
  }, [initialPrompt, onPromptCleared]);

  // Auto-resize textarea height
  const handleInput = (e) => {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    if (!value.trim()) return;

    let finalMessage = value.trim();
    if (isWebSearchActive) {
      finalMessage = `[Web Search Active] ${finalMessage}`;
    }
    if (isReasoningActive) {
      finalMessage = `[Deep Reasoning] ${finalMessage}`;
    }

    dispatch(sendMessageAsync({ message: finalMessage, ConversationId }));
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

  // Speech Recognition support
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const canSubmit = value.trim().length > 0;

  return (
    <div className="w-full bg-[#212121] px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col rounded-[26px] border border-[#383737] bg-[#2f2f2f] p-2.5 shadow-lg transition-all focus-within:border-[#525252] focus-within:ring-1 focus-within:ring-[#525252]"
        >
          {/* Main Textarea */}
          <div className="flex items-start px-2 pt-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Message ChatGPT..."
              className="max-h-[200px] min-h-[24px] w-full resize-none bg-transparent text-[15px] leading-6 text-[#ececec] placeholder-[#8e8e8e] outline-none"
            />
          </div>

          {/* Bottom Toolbar inside Input Dock */}
          <div className="mt-2 flex items-center justify-between px-1.5 pt-1">
            {/* Left Action Tools */}
            <div className="flex items-center gap-1.5">
              {/* Attach File Button */}
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#b4b4b4] transition-colors hover:bg-[#3e3e3e] hover:text-white"
                title="Attach files"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>

              {/* Web Search Toggle */}
              <button
                type="button"
                onClick={() => setIsWebSearchActive(!isWebSearchActive)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  isWebSearchActive
                    ? 'bg-blue-600/30 text-blue-400 border border-blue-500/50'
                    : 'text-[#b4b4b4] hover:bg-[#3e3e3e] hover:text-white'
                }`}
                title="Search the web"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                <span>Search</span>
              </button>

              {/* Deep Reasoning Toggle */}
              <button
                type="button"
                onClick={() => setIsReasoningActive(!isReasoningActive)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  isReasoningActive
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                    : 'text-[#b4b4b4] hover:bg-[#3e3e3e] hover:text-white'
                }`}
                title="Reason deeply"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                  <path d="M10 21h4" />
                </svg>
                <span>Reason</span>
              </button>
            </div>

            {/* Right Action Tools */}
            <div className="flex items-center gap-2">
              {/* Voice Microphone Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-[#b4b4b4] hover:bg-[#3e3e3e] hover:text-white'
                }`}
                title={isListening ? 'Listening...' : 'Dictate message'}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              </button>

              {/* Submit / Arrow Up Button */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                  canSubmit
                    ? 'bg-white text-black shadow hover:bg-[#ececec] cursor-pointer'
                    : 'bg-[#494949] text-[#2f2f2f] cursor-not-allowed'
                }`}
                title="Send message"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {/* Disclaimer note */}
        <div className="mt-2 text-center text-xs text-[#8e8e8e]">
          ChatGPT can make mistakes. Check important info.
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
