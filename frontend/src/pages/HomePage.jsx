import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <main className="app-shell min-h-screen pt-[76px] px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-120px)] max-w-7xl items-center justify-center">
        <div className="chat-panel h-[min(780px,calc(100vh-116px))] min-h-[520px] w-full overflow-hidden rounded-3xl">
          <div className="flex h-full overflow-hidden">
            <Sidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </main>
  );
};
export default HomePage;
