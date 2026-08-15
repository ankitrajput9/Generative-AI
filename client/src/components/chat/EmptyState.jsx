const promptSuggestions = [
  {
    icon: (
      <svg className="h-5 w-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Brainstorm ideas',
    desc: 'for a modern AI web application and core features',
    prompt: 'Brainstorm 5 unique, high-value AI features for a modern web app, including practical use cases and user benefits.',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: 'Code a Python script',
    desc: 'to parse JSON data and visualize results',
    prompt: 'Write a clean Python script to parse a JSON dataset, extract key metrics, and plot the distribution using matplotlib with syntax-highlighted code.',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Help me write',
    desc: 'a clear and engaging announcement post',
    prompt: 'Draft an exciting launch announcement post for a new AI workspace product, formatted with markdown headings and bullet points.',
  },
  {
    icon: (
      <svg className="h-5 w-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: 'Explain complex concepts',
    desc: 'like quantum computing in simple terms',
    prompt: 'Explain quantum computing, superposition, and quantum entanglement using simple, intuitive real-world analogies and markdown formatting.',
  },
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
