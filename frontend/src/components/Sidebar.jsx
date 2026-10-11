import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Copy, Search, Users } from "lucide-react";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getUsers();
    const refresh = setInterval(() => getUsers({ silent: true }), 5000);
    return () => clearInterval(refresh);
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => user.isOnline)
    : users;
  const visibleUsers = filteredUsers.filter((user) => user.fullName.toLowerCase().includes(query.toLowerCase()));
  const onlineCount = users.filter((user) => user.isOnline).length;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="chat-sidebar flex h-full w-[76px] shrink-0 flex-col border-r border-[#e9eeea] bg-[#fbfcfb] transition-all duration-200 lg:w-[310px]">
      <div className="chat-sidebar-header w-full border-b border-[#e9eeea] px-4 pb-4 pt-6 lg:px-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#243c32]"><Users className="size-5" /><span className="hidden font-bold lg:block">Your people</span></div>
          <span className="hidden items-center gap-1.5 rounded-full bg-[#e9f4ed] px-2 py-1 text-[11px] font-bold text-[#34785e] lg:flex">
            {users.length} contacts
            {users.some((user) => user.unreadCount > 0) && <span className="rounded-full bg-rose-500 px-1.5 text-white">{users.reduce((total, user) => total + user.unreadCount, 0)}</span>}
          </span>
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
          <span className="text-xs text-[#82928a]">({onlineCount} online now)</span>
        </div>
      </div>

      <div className="soft-scrollbar w-full flex-1 overflow-y-auto py-3">
        {visibleUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`chat-contact-button
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
              {user.isOnline && (
                <span
                  className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-[#39a978]"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="chat-contact-name truncate text-sm font-bold text-[#2d4037]">{user.fullName}</div>
              <div className="chat-contact-status mt-0.5 text-xs text-[#84948b]">
                {user.isOnline ? "Online" : "Offline"}
              </div>
              {user.unreadCount > 0 && <span className="mt-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{user.unreadCount}</span>}
            </div>
          </button>
        ))}

        {visibleUsers.length === 0 && users.length === 0 && (
          <div className="mx-4 my-5 rounded-2xl border border-[#e5ece7] bg-white p-4 text-center lg:mx-5">
            <p className="text-sm font-semibold text-[#344b40]">You’re ready to chat</p>
            <p className="mt-2 text-xs leading-5 text-[#7c8e84]">Share Mingle with someone. Once they create an account, they’ll appear here automatically.</p>
            <button
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#246b55] px-3 py-2 text-xs font-semibold text-white hover:bg-[#1e5b48]"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.origin);
                  toast.success("Mingle link copied");
                } catch {
                  toast.error("Could not copy the link");
                }
              }}
            >
              <Copy className="size-3.5" /> Copy invite link
            </button>
          </div>
        )}
        {visibleUsers.length === 0 && users.length > 0 && (
          <div className="px-4 py-5 text-center text-sm text-[#7c8e84]">
            {showOnlineOnly ? "No one is online right now" : "No people match that search"}
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
