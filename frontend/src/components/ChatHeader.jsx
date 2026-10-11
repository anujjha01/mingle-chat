import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  return (
    <div className="chat-header flex items-center justify-between border-b border-[#e9eeea] bg-white px-4 py-3.5 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="relative size-11 rounded-full ring-2 ring-[#e8f1eb]">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="text-sm font-extrabold text-[#253b31]">{selectedUser.fullName}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#7d8e84]">
              {selectedUser.isOnline && <span className="size-1.5 rounded-full bg-[#3ca577]" />}
              {selectedUser.isOnline ? "Online now" : "Away"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button className="rounded-xl p-2 text-[#83928a] transition hover:bg-[#f0f5f1] hover:text-[#246b55]" aria-label="Close conversation" onClick={() => setSelectedUser(null)}>
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
