const Input = ({ label, error, ...props }) => (
  <label className="block text-sm text-slate-700">
    <span className="mb-1 block">{label}</span>
    <input
      className={`w-full rounded-lg border px-3 py-2 outline-none ring-0 focus:border-slate-500 ${error ? 'border-red-400 focus:border-red-500' : 'border-slate-300'}`}
      {...props}
    />
    {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
  </label>
);

export default Input;
