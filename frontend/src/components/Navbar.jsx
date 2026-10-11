import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Bell, LogOut, Moon, Settings, Sun, User } from "lucide-react";
import MingleLogo from "./MingleLogo";
import { useThemeStore } from "../store/useThemeStore";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { users } = useChatStore();
  const unreadCount = users.reduce((total, user) => total + user.unreadCount, 0);

  useEffect(() => {
    document.title = unreadCount ? `(${unreadCount}) Mingle` : "Mingle";
  }, [unreadCount]);

  const enableNotifications = async () => {
    if (!("Notification" in window)) return toast.error("This browser does not support notifications");
    if (Notification.permission === "granted") return toast("Message notifications are enabled");
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") toast.success("Message notifications enabled");
      else toast("Unread messages will still appear in Mingle");
    } catch {
      toast.error("Could not enable browser notifications");
    }
  };

  return (
    <header
      className="fixed top-0 z-40 w-full border-b border-base-300 bg-base-100/85 text-base-content backdrop-blur-xl"
    >
      <div className="container mx-auto h-16 px-3 sm:px-4">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="transition-opacity hover:opacity-80">
              <MingleLogo />
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {authUser && (
              <button
                type="button"
              className="relative rounded-xl p-1.5 text-base-content/70 transition hover:bg-base-200 hover:text-primary sm:p-2"
                onClick={enableNotifications}
                aria-label="Enable message notifications"
                title="Enable message notifications"
              >
                <Bell className="size-4" />
                {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
              </button>
            )}
            <button
              type="button"
              className="rounded-xl p-1.5 text-base-content/70 transition hover:bg-base-200 hover:text-primary sm:p-2"
              onClick={() => setTheme(theme === "dark" ? "mingle" : "dark")}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to={"/settings"}
              className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-200 hover:text-primary sm:px-3"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
            <Link to={"/profile"} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-[#60746b] transition hover:bg-[#f0f5f1] hover:text-[#246b55] sm:px-3">
                  <User className="size-4 sm:size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-semibold text-[#60746b] transition hover:bg-[#f0f5f1] hover:text-[#246b55] sm:px-3" onClick={logout}>
                  <LogOut className="size-4 sm:size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
