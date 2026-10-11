const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="relative hidden items-center justify-center overflow-hidden bg-[#eaf2ec] p-12 lg:flex">
      <div className="absolute -right-32 -top-24 size-96 rounded-full bg-[#cfe2d3]/70 blur-3xl" />
      <div className="absolute -bottom-36 -left-24 size-96 rounded-full bg-[#d9e9db]/80 blur-3xl" />
      <div className="relative max-w-md text-center">
        <div className="mb-10 rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-xl shadow-[#214b3620] backdrop-blur">
          <div className="mb-5 flex items-center gap-3 border-b border-[#e5eee6] pb-4 text-left">
            <div className="brand-mark flex size-10 items-center justify-center rounded-xl"><MessageSquareIcon /></div>
            <div><div className="font-extrabold text-[#273e33]">Mingle</div><div className="text-xs text-[#84958b]">your space to connect</div></div>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[#edf6ef] px-2.5 py-1 text-[10px] font-bold text-[#34785e]"><span className="size-1.5 rounded-full bg-[#3ca577]" /> LIVE</span>
          </div>
          <div className="space-y-3 text-left">
            <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-[#246b55] px-4 py-3 text-sm text-white">Hey, are we still on for coffee? ☕</div>
            <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-[#40544a] shadow-sm">Absolutely! Found a cozy spot nearby 🌿</div>
            <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-md bg-[#246b55] px-4 py-3 text-sm text-white">Perfect. See you soon!</div>
          </div>
        </div>
        <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-[#263d32]">{title}</h2>
        <p className="leading-7 text-[#73877b]">{subtitle}</p>
      </div>
    </div>
  );
};

const MessageSquareIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" /></svg>;

export default AuthImagePattern;
