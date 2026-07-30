import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import Button from '../common/Button';

const Navbar = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">AI Workspace</h1>
          <p className="text-sm text-slate-500">{isAuthenticated ? `Signed in as ${user?.name || 'User'}` : 'Welcome'}</p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => dispatch(logoutUser())}>Logout</Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
