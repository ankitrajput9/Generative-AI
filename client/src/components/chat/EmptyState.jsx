const promptSuggestions = [
 
];

const EmptyState = ({ onSelectPrompt }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      {/* ChatGPT Sparkle Emblem */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#3e3e3e] bg-[#212121] shadow-xl">
        <svg className="h-9 w-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      </div>

      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        What can I help with today?
      </h1>

      {/* Suggestion Cards */}
      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group flex flex-col items-start justify-between rounded-2xl border border-[#383737] bg-[#212121] p-4 text-left transition-all duration-200 hover:border-[#525252] hover:bg-[#2a2a2a] hover:shadow-lg"
          >
            <div className="mb-2 flex w-full items-center justify-between">
              <span className="text-sm font-semibold text-[#ececec] group-hover:text-white">
                {item.title}
              </span>
              <div className="transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </div>
            </div>
            <p className="text-xs text-[#9b9b9b] leading-relaxed group-hover:text-[#b4b4b4]">
              {item.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmptyState;
