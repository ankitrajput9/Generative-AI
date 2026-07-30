const Input = ({ label, ...props }) => (
  <label className="block text-sm text-slate-700">
    <span className="mb-1 block">{label}</span>
    <input
      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-0 focus:border-slate-500"
      {...props}
    />
  </label>
);

export default Input;
