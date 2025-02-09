import Message from "./Message";

type Message = {
  text: string;
  sender: "user" | "bot";
};

type ChatWindowProps = {
  messages: Message[];
};

export default function ChatWindow({ messages }: ChatWindowProps) {
  return (
    <div className="border border-gray-300 p-4 h-[60vh] overflow-y-auto mb-4 rounded-lg bg-gray-50">
      {messages.map((msg, idx) => (
        <Message key={idx} text={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
}
