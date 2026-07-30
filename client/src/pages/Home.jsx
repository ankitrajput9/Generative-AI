import MainLayout from '../layouts/MainLayout';
import ChatList from '../components/chat/ChatList';
import Conversation from '../components/chat/Conversation';

const Home = () => (
  <MainLayout>
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <ChatList />
      <Conversation />
    </div>
  </MainLayout>
);

export default Home;
