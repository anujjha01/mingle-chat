import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="fixed top-0 z-40 w-full border-b border-[#e5ebe6] bg-white/85 backdrop-blur-xl"
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
            <Link
              to={"/settings"}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-[#60746b] transition hover:bg-[#f0f5f1] hover:text-[#246b55]"
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
