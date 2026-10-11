import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Moon, Settings, Sun, User } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { theme, setTheme } = useThemeStore();

  return (
    <header
      className="fixed top-0 z-40 w-full border-b border-base-300 bg-base-100/85 text-base-content backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="brand-mark flex size-9 items-center justify-center rounded-xl">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div><h1 className="text-base font-extrabold tracking-tight">Mingle</h1><span className="-mt-0.5 block text-[10px] font-medium tracking-[.16em] text-[#769087]">MESSAGES, IN REAL TIME</span></div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl p-2 text-base-content/70 transition hover:bg-base-200 hover:text-primary"
              onClick={() => setTheme(theme === "dark" ? "mingle" : "dark")}
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              to={"/settings"}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-base-content/70 transition hover:bg-base-200 hover:text-primary"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
            <Link to={"/profile"} className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#60746b] transition hover:bg-[#f0f5f1] hover:text-[#246b55]">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#60746b] transition hover:bg-[#f0f5f1] hover:text-[#246b55]" onClick={logout}>
                  <LogOut className="size-5" />
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
