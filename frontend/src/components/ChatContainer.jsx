import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    const refreshMessages = setInterval(() => getMessages(selectedUser._id, { silent: true }), 2500);
    return () => {
      clearInterval(refreshMessages);
      unsubscribeFromMessages();
    };
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) return <div className="flex flex-1 flex-col overflow-hidden"><ChatHeader /><MessageSkeleton /><MessageInput /></div>;

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <ChatHeader />
      <div className="chat-message-list soft-scrollbar flex-1 space-y-5 overflow-y-auto bg-[linear-gradient(180deg,#fbfdfb,#f8faf8)] px-4 py-5 sm:px-7">
        {messages.length === 0 && <div className="flex h-full min-h-40 items-center justify-center text-center text-sm text-[#84948b]">This is the beginning of your conversation.<br />Say hello to {selectedUser.fullName.split(" ")[0]} 👋</div>}
        {messages.map((message) => {
          const mine = message.senderId === authUser._id;
          return (
            <div key={message._id} className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
              {!mine && <div className="avatar mb-1 shrink-0"><div className="size-7 rounded-full"><img src={selectedUser.profilePic || "/avatar.png"} alt="" /></div></div>}
              <div className="max-w-[82%] sm:max-w-[68%]">
                <div className={`mb-1 text-[10px] font-semibold text-[#9aa79f] ${mine ? "text-right" : ""}`}>{mine ? "You" : selectedUser.fullName.split(" ")[0]} · {formatMessageTime(message.createdAt)}</div>
                <div className={`message-bubble px-4 py-2.5 shadow-sm ${mine ? "mine" : "theirs"}`}>
                  {message.image && <img src={message.image} alt="Attachment" className="mb-2 max-h-64 rounded-xl object-cover" />}
                  {message.text && <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <MessageInput />
    </section>
  );
};
export default ChatContainer;
