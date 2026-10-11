import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#f5faf5,transparent_70%)] p-8">
      <div className="max-w-md text-center space-y-6">
        {/* Icon Display */}
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="brand-mark flex h-16 w-16 items-center justify-center rounded-2xl"
            >
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-extrabold tracking-tight text-[#233a30]">A little closer, wherever you are.</h2>
        <p className="mx-auto max-w-sm text-sm leading-6 text-[#7c8e84]">
          Pick someone from your contacts and start a conversation. New people and messages show up automatically.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
