import { GiArtificialHive } from "react-icons/gi";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import { useChat } from "./utils/useChat";

export default function ChatComponent() {
  const { messages, sendMessage, stopResponse, isLoading } = useChat();

  return (
    <div className="w-full h-screen font-sans bg-white p-4 rounded-lg shadow-lg">
      <div className="w-[70%] mx-auto pt-[10%]">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-800 mb-4">
          <GiArtificialHive className="w-12 h-12" /> Roma Monstr GPT
        </h2>
        <ChatWindow messages={messages} />
        <MessageInput onSend={sendMessage} onStop={stopResponse} isLoading={isLoading} />
      </div>
    </div>
  );
}
