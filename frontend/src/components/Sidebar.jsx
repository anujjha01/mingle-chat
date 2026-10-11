import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search, Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;
  const visibleUsers = filteredUsers.filter((user) => user.fullName.toLowerCase().includes(query.toLowerCase()));

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="flex h-full w-[76px] shrink-0 flex-col border-r border-[#e9eeea] bg-[#fbfcfb] transition-all duration-200 lg:w-[310px]">
      <div className="w-full border-b border-[#e9eeea] px-4 pb-4 pt-6 lg:px-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#243c32]"><Users className="size-5" /><span className="hidden font-bold lg:block">Your people</span></div>
          <span className="hidden rounded-full bg-[#e9f4ed] px-2 py-1 text-[11px] font-bold text-[#34785e] lg:block">{users.length} contacts</span>
        </div>
        <div className="relative mt-4 hidden lg:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#90a098]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a conversation" className="w-full rounded-xl border border-[#e7ede8] bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9ba9a1] focus:border-[#a9cbb8] focus:ring-2 focus:ring-[#e1f0e7]" /></div>
        <div className="mt-3 hidden items-center gap-2 lg:flex">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm [--chkbg:#246b55] [--chkfg:white]"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-[#82928a]">({onlineUsers.length} online now)</span>
        </div>
      </div>

      <div className="soft-scrollbar w-full flex-1 overflow-y-auto py-3">
        {visibleUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              mx-2 flex w-[calc(100%-16px)] items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-[#f0f5f1] lg:mx-3 lg:w-[calc(100%-24px)] lg:px-3
              ${selectedUser?._id === user._id ? "bg-[#edf5ef] ring-1 ring-[#dbe9de]" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-11 rounded-full object-cover ring-2 ring-white"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#39a978]"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="truncate text-sm font-bold text-[#2d4037]">{user.fullName}</div>
              <div className="mt-0.5 text-xs text-[#84948b]">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {visibleUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
