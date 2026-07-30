import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import RightSidebar from '../components/layout/RightSidebar';

const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-100 text-slate-900">
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <RightSidebar />
    </div>
  </div>
);

export default MainLayout;
