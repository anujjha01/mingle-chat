const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="relative hidden items-center justify-center overflow-hidden bg-[#eaf2ec] p-12 lg:flex">
      <div className="absolute -right-32 -top-24 size-96 rounded-full bg-[#cfe2d3]/70 blur-3xl" />
      <div className="absolute -bottom-36 -left-24 size-96 rounded-full bg-[#d9e9db]/80 blur-3xl" />
      <div className="relative max-w-md text-center">
        <div className="mb-10 rounded-[2rem] border border-white/70 bg-white/60 p-5 shadow-xl shadow-[#214b3620] backdrop-blur">
          <div className="mb-5 flex items-center gap-3 border-b border-[#e5eee6] pb-4 text-left">
            <MingleLogo iconSize="size-8" />
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

export default AuthImagePattern;
import MingleLogo from "./MingleLogo";

