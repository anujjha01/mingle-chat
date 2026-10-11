import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="empty-chat-panel flex w-full flex-1 flex-col items-center justify-center p-8">
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
        <h2 className="empty-chat-title text-2xl font-extrabold tracking-tight">A little closer, wherever you are.</h2>
        <p className="empty-chat-copy mx-auto max-w-sm text-sm leading-6">
          Pick someone from your contacts and start a conversation. New people and messages show up automatically.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
