import { NavLink } from 'react-router-dom';
import ChatList from '../chat/ChatList';

const links = [{ to: '/', label: 'Home' }];

const Sidebar = () => (
  <aside className="hidden w-64 border-r border-slate-200 bg-slate-50 p-6 md:flex md:flex-col">
    <h2 className="mb-6 text-xl font-semibold">Generative AI</h2>
    <nav className="space-y-2">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
    <div className="mt-6 flex-1 overflow-hidden">
      <ChatList />
    </div>
  </aside>
);

export default Sidebar;
